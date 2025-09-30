// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WrappedU2U
 * @dev ERC20 token that wraps native U2U in 1:1 ratio
 * @notice This contract allows users to wrap U2U into wU2U tokens for use in DeFi protocols
 */
contract WrappedU2U is ERC20, ReentrancyGuard {
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    constructor() ERC20("Wrapped U2U", "wU2U") {}
    
    /**
     * @notice Deposit U2U and mint equivalent wU2U tokens
     * @dev Mints wU2U tokens 1:1 with deposited U2U
     */
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must send U2U");
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw U2U by burning wU2U tokens
     * @param amount Amount of wU2U to burn and U2U to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient wU2U balance");
        
        _burn(msg.sender, amount);
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "U2U transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Fallback function to wrap U2U when sent directly to contract
     */
    receive() external payable {
        if (msg.value > 0) {
            _mint(msg.sender, msg.value);
            emit Deposit(msg.sender, msg.value);
        }
    }
    
    /**
     * @notice Get the total U2U backing this contract
     * @return Total U2U balance of the contract
     */
    function totalU2UBacking() external view returns (uint256) {
        return address(this).balance;
    }
}
