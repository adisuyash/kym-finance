// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PrincipalToken.sol";
import "./YieldToken.sol";
import "./WrappedU2U.sol";

/**
 * @title YieldSplitter
 * @dev Main contract that splits wU2U into PT-wU2U and YT-wU2U tokens
 * @notice This contract handles deposit, split, redeem, and yield distribution
 */
contract YieldSplitter is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    // Token contracts
    WrappedU2U public immutable wrappedU2U;
    PrincipalToken public immutable principalToken;
    YieldToken public immutable yieldToken;
    
    // Maturity timestamp
    uint256 public immutable maturity;
    
    // Contract state
    uint256 public totalDeposited;
    uint256 public totalYieldDistributed;
    uint256 public lastYieldDistribution;
    bool public isExpired;
    
    // Pendle-style pricing parameters
    uint256 public yieldPercentage; // Annual yield percentage in basis points (e.g., 500 = 5%)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60; // 31,557,600 seconds
    
    // User tracking
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userPTBalance;
    mapping(address => uint256) public userYTBalance;
    
    // Yield distribution
    uint256 public yieldDistributionInterval = 1 days;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Split(address indexed user, uint256 wU2UAmount, uint256 ptAmount, uint256 ytAmount);
    event Redeem(address indexed user, uint256 ptAmount, uint256 ytAmount, uint256 wU2UAmount);
    event YieldDistributed(uint256 amount, uint256 timestamp);
    event MaturityReached();
    
    modifier onlyBeforeMaturity() {
        require(block.timestamp < maturity, "Contract has matured");
        _;
    }
    
    modifier onlyAfterMaturity() {
        require(block.timestamp >= maturity, "Contract not yet matured");
        _;
    }
    
    constructor(
        address payable _wrappedU2U,
        uint256 _maturityDuration, // Duration in seconds (e.g., 365 days)
        uint256 _yieldPercentage   // Annual yield percentage in basis points (e.g., 500 = 5%)
    ) {
        wrappedU2U = WrappedU2U(_wrappedU2U);
        maturity = block.timestamp + _maturityDuration;
        yieldPercentage = _yieldPercentage;
        
        // Deploy PT and YT tokens
        principalToken = new PrincipalToken(
            "Principal Token wU2U",
            "PT-wU2U",
            _wrappedU2U,
            maturity
        );
        
        yieldToken = new YieldToken(
            "Yield Token wU2U", 
            "YT-wU2U",
            _wrappedU2U,
            maturity
        );
        
        // Set this contract as the yield splitter for both tokens
        principalToken.setYieldSplitter(address(this));
        yieldToken.setYieldSplitter(address(this));
        
        // Cross-reference the tokens
        principalToken.setYieldToken(address(yieldToken));
        yieldToken.setPrincipalToken(address(principalToken));
        
        lastYieldDistribution = block.timestamp;
    }
    
    /**
     * @notice Calculate Pendle-style pricing for PT and YT tokens
     * @param amount Total amount to split
     * @return ptAmount Amount of PT tokens to mint
     * @return ytAmount Amount of YT tokens to mint
     */
    function calculatePendlePricing(uint256 amount) public view returns (uint256 ptAmount, uint256 ytAmount) {
        // Calculate time to maturity in years (with precision)
        uint256 timeToMaturity = maturity - block.timestamp;
        
        // If already matured, use 1:1 ratio
        if (timeToMaturity == 0) {
            return (amount, amount);
        }
        
        // Calculate discount factor: DF = 1 / (1 + r)^t
        // Using fixed-point arithmetic with 18 decimals for precision
        uint256 PRECISION = 1e18;
        
        // Convert yield percentage from basis points to decimal (with precision)
        uint256 yieldRate = (yieldPercentage * PRECISION) / BASIS_POINTS; // r in 18 decimals
        
        // Calculate (1 + r) in 18 decimals
        uint256 onePlusR = PRECISION + yieldRate;
        
        // Calculate time factor: t = timeToMaturity / SECONDS_PER_YEAR (in 18 decimals)
        uint256 timeFactor = (timeToMaturity * PRECISION) / SECONDS_PER_YEAR;
        
        // Calculate (1 + r)^t using approximation for small t
        // For simplicity, using linear approximation: (1 + r)^t ≈ 1 + r*t
        uint256 discountDenominator = PRECISION + (yieldRate * timeFactor) / PRECISION;
        
        // Calculate PT amount: PT = amount * (1 / (1 + r*t))
        ptAmount = (amount * PRECISION) / discountDenominator;
        
        // Calculate YT amount: YT = amount - PT
        ytAmount = amount - ptAmount;
        
        return (ptAmount, ytAmount);
    }
    
    /**
     * @notice Deposit wU2U and split into PT and YT tokens using Pendle pricing
     * @param amount Amount of wU2U to deposit and split
     */
    function depositAndSplit(uint256 amount) external nonReentrant onlyBeforeMaturity {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer wU2U from user
        wrappedU2U.transferFrom(msg.sender, address(this), amount);
        
        // Calculate Pendle-style pricing
        (uint256 ptAmount, uint256 ytAmount) = calculatePendlePricing(amount);
        
        // Update tracking
        userDeposits[msg.sender] += amount;
        userPTBalance[msg.sender] += ptAmount;
        userYTBalance[msg.sender] += ytAmount;
        totalDeposited += amount;
        
        // Mint PT and YT tokens using Pendle pricing
        principalToken.mint(msg.sender, ptAmount);
        yieldToken.mint(msg.sender, ytAmount);
        
        emit Deposit(msg.sender, amount);
        emit Split(msg.sender, amount, ptAmount, ytAmount);
    }
    
    /**
     * @notice Redeem PT and YT tokens back to wU2U before maturity
     * @param amount Amount of PT+YT tokens to redeem
     */
    function redeemBeforeMaturity(uint256 amount) external nonReentrant onlyBeforeMaturity {
        require(amount > 0, "Amount must be greater than 0");
        require(principalToken.balanceOf(msg.sender) >= amount, "Insufficient PT balance");
        require(yieldToken.balanceOf(msg.sender) >= amount, "Insufficient YT balance");
        
        // Burn PT and YT tokens
        principalToken.burn(msg.sender, amount);
        yieldToken.burn(msg.sender, amount);
        
        // Update tracking
        userPTBalance[msg.sender] -= amount;
        userYTBalance[msg.sender] -= amount;
        totalDeposited -= amount;
        
        // Transfer wU2U back to user
        wrappedU2U.transfer(msg.sender, amount);
        
        emit Redeem(msg.sender, amount, amount, amount);
    }
    
    /**
     * @notice Redeem PT tokens for wU2U after maturity
     * @param amount Amount of PT tokens to redeem
     */
    function redeemPTAfterMaturity(uint256 amount) external nonReentrant onlyAfterMaturity {
        require(amount > 0, "Amount must be greater than 0");
        require(principalToken.balanceOf(msg.sender) >= amount, "Insufficient PT balance");
        
        // Burn PT tokens
        principalToken.burn(msg.sender, amount);
        
        // Update tracking
        userPTBalance[msg.sender] -= amount;
        
        // Transfer wU2U back to user (1:1 redemption)
        wrappedU2U.transfer(msg.sender, amount);
        
        emit Redeem(msg.sender, amount, 0, amount);
    }
    
    /**
     * @notice Claim yield from YT tokens
     * @return yieldAmount Amount of yield claimed
     */
    function claimYield() external nonReentrant returns (uint256 yieldAmount) {
        yieldAmount = yieldToken.getClaimableYield(msg.sender);
        require(yieldAmount > 0, "No yield to claim");
        
        // Trigger yield claim in YT contract
        yieldToken.claimYield();
        
        // Transfer yield to user (in wU2U)
        // Note: In a real implementation, this would come from actual yield generation
        // For MVP, we'll mint new wU2U as mock yield
        _distributeYieldToUser(msg.sender, yieldAmount);
        
        totalYieldDistributed += yieldAmount;
    }
    
    /**
     * @notice Distribute yield to all YT holders (can be called by anyone)
     */
    function distributeYield() external nonReentrant {
        require(
            block.timestamp >= lastYieldDistribution + yieldDistributionInterval,
            "Too early for yield distribution"
        );
        
        // Mock yield generation - in reality this would come from staking/lending
        uint256 yieldToDistribute = _calculateMockYield();
        
        if (yieldToDistribute > 0) {
            lastYieldDistribution = block.timestamp;
            totalYieldDistributed += yieldToDistribute;
            emit YieldDistributed(yieldToDistribute, block.timestamp);
        }
    }
    
    /**
     * @notice Mark contract as expired after maturity
     */
    function markAsExpired() external onlyAfterMaturity {
        if (!isExpired) {
            isExpired = true;
            principalToken.markAsExpired();
            yieldToken.markAsExpired();
            emit MaturityReached();
        }
    }
    
    /**
     * @notice Get user's current position
     * @param user Address to check
     * @return ptBalance PT token balance
     * @return ytBalance YT token balance  
     * @return claimableYield Amount of yield claimable
     */
    function getUserPosition(address user) external view returns (
        uint256 ptBalance,
        uint256 ytBalance,
        uint256 claimableYield
    ) {
        ptBalance = principalToken.balanceOf(user);
        ytBalance = yieldToken.balanceOf(user);
        claimableYield = yieldToken.getClaimableYield(user);
    }
    
    /**
     * @notice Get contract statistics
     * @return totalDeposited_ Total wU2U deposited
     * @return totalYieldDistributed_ Total yield distributed
     * @return maturity_ Maturity timestamp
     * @return isExpired_ Whether contract has expired
     */
    function getContractStats() external view returns (
        uint256 totalDeposited_,
        uint256 totalYieldDistributed_,
        uint256 maturity_,
        bool isExpired_
    ) {
        totalDeposited_ = totalDeposited;
        totalYieldDistributed_ = totalYieldDistributed;
        maturity_ = maturity;
        isExpired_ = isExpired;
    }
    
    /**
     * @notice Calculate mock yield for demonstration
     * @return yieldAmount Mock yield amount
     */
    function _calculateMockYield() internal view returns (uint256 yieldAmount) {
        if (totalDeposited == 0) return 0;
        
        // Mock 5% APY distributed daily
        // yieldAmount = (totalDeposited * 5 * 1 day) / (100 * 365 days)
        yieldAmount = (totalDeposited * 5) / (100 * 365);
        
        // Cap at available balance
        uint256 availableBalance = wrappedU2U.balanceOf(address(this));
        if (yieldAmount > availableBalance / 10) { // Don't use more than 10% of reserves
            yieldAmount = availableBalance / 10;
        }
    }
    
    /**
     * @notice Distribute yield to a specific user (internal)
     * @param user User to distribute yield to
     * @param amount Amount of yield to distribute
     */
    function _distributeYieldToUser(address user, uint256 amount) internal {
        // In a real implementation, this would come from actual yield sources
        // For MVP demo, we'll use contract's wU2U balance or mint new tokens
        uint256 contractBalance = wrappedU2U.balanceOf(address(this));
        
        if (contractBalance >= amount) {
            wrappedU2U.transfer(user, amount);
        } else {
            // Fallback: mint new wU2U as mock yield (deposit U2U to wU2U contract)
            // This is just for demo purposes
            wrappedU2U.deposit{value: amount}();
            wrappedU2U.transfer(user, amount);
        }
    }
    
    /**
     * @notice Emergency function to recover stuck tokens (only owner)
     */
    function emergencyRecover(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
    
    /**
     * @notice Set yield distribution interval (only owner)
     */
    function setYieldDistributionInterval(uint256 _interval) external onlyOwner {
        yieldDistributionInterval = _interval;
    }
    
    // Allow contract to receive U2U for mock yield generation
    receive() external payable {}
}
