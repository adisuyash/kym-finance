// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WETH
 * @dev ERC20 token that wraps native ETH in 1:1 ratio
 * @notice This contract allows users to wrap ETH into WETH tokens for use in DeFi protocols
 */
contract WETH is ERC20, ReentrancyGuard {
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    constructor() ERC20("Wrapped Ether", "WETH") {}
    
    /**
     * @notice Deposit ETH and mint equivalent WETH tokens
     * @dev Mints WETH tokens 1:1 with deposited ETH
     */
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw ETH by burning WETH tokens
     * @param amount Amount of WETH to burn and ETH to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient WETH balance");
        
        _burn(msg.sender, amount);
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Fallback function to wrap ETH when sent directly to contract
     */
    receive() external payable {
        if (msg.value > 0) {
            _mint(msg.sender, msg.value);
            emit Deposit(msg.sender, msg.value);
        }
    }
    
    /**
     * @notice Get the total ETH backing this contract
     * @return Total ETH balance of the contract
     */
    function totalETHBacking() external view returns (uint256) {
        return address(this).balance;
    }
}
