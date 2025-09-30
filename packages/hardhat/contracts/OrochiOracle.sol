// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@orochi-network/contracts/IOrocleAggregatorV2.sol';

/**
 * @title Orochi Oracle
 * @dev Price Oracle for U2U ecosystem using Orochi Network (Orocle)
 *      Provides prices for underlying, PT, and YT tokens.
 */
contract OrochiOracle is Ownable, ReentrancyGuard {
  // Price feed data
  struct PriceFeed {
    uint256 price; // Price with 18 decimals
    uint256 timestamp; // Last update
    uint256 heartbeat; // Max time between updates
    bool isActive; // Active flag
  }

  // Orochi Oracle
  IOrocleAggregatorV2 public orochi;
  address public constant OROCHI_ADDRESS = 0x70523434ee6a9870410960E2615406f8F9850676;

  // Price feeds mapping
  mapping(string => PriceFeed) public priceFeeds;
  string[] public supportedFeeds;

  // Constants
  uint256 public constant DEFAULT_HEARTBEAT = 3600; // 1 hour

  // Events
  event PriceUpdated(string indexed key, uint256 price, uint256 timestamp);
  event FeedAdded(string indexed key, uint256 heartbeat);
  event FeedRemoved(string indexed key);
  event OrochiUpdated(address indexed newOrochi);

  constructor() {
    // Initialize Orochi
    _setOrochi(OROCHI_ADDRESS);

    // Initialize feeds
    _addPriceFeed('U2U/USD', DEFAULT_HEARTBEAT);
    _addPriceFeed('PT-wU2U/USD', DEFAULT_HEARTBEAT);
    _addPriceFeed('YT-wU2U/USD', DEFAULT_HEARTBEAT);

    // Mock initial prices
    _updatePrice('U2U/USD', 0.05e18);
    _updatePrice('PT-wU2U/USD', 0.048e18);
    _updatePrice('YT-wU2U/USD', 0.002e18);
  }

  function _setOrochi(address newOrochi) internal {
    orochi = IOrocleAggregatorV2(newOrochi);
    emit OrochiUpdated(newOrochi);
  }

  function setOrochi(address newOrochi) external onlyOwner {
    _setOrochi(newOrochi);
  }

  function _getPrice(bytes20 identifier) internal view returns (uint256) {
    return uint256(orochi.getLatestData(1, identifier));
  }

  function updatePriceFromOrochi(string memory key, bytes20 identifier) external onlyOwner {
    require(priceFeeds[key].isActive, 'Feed not active');
    uint256 price = _getPrice(identifier);
    _updatePrice(key, price);
  }

  // ---- Price feed management ----
  function addPriceFeed(string memory key, uint256 heartbeat) external onlyOwner {
    _addPriceFeed(key, heartbeat);
  }

  function removePriceFeed(string memory key) external onlyOwner {
    require(priceFeeds[key].isActive, 'Feed not active');
    priceFeeds[key].isActive = false;

    for (uint256 i = 0; i < supportedFeeds.length; i++) {
      if (keccak256(bytes(supportedFeeds[i])) == keccak256(bytes(key))) {
        supportedFeeds[i] = supportedFeeds[supportedFeeds.length - 1];
        supportedFeeds.pop();
        break;
      }
    }

    emit FeedRemoved(key);
  }

  function _addPriceFeed(string memory key, uint256 heartbeat) internal {
    require(!priceFeeds[key].isActive, 'Feed exists');
    priceFeeds[key] = PriceFeed(0, 0, heartbeat, true);
    supportedFeeds.push(key);
    emit FeedAdded(key, heartbeat);
  }

  function _updatePrice(string memory key, uint256 price) internal {
    require(priceFeeds[key].isActive, 'Feed not active');
    require(price > 0, 'Invalid price');

    priceFeeds[key].price = price;
    priceFeeds[key].timestamp = block.timestamp;
    emit PriceUpdated(key, price, block.timestamp);
  }

  function getPrice(string memory key) external view returns (uint256 price, uint256 timestamp) {
    PriceFeed memory feed = priceFeeds[key];
    require(feed.isActive, 'Feed not active');
    require(block.timestamp - feed.timestamp <= feed.heartbeat, 'Price stale');
    return (feed.price, feed.timestamp);
  }

  function getLatestPrice(string memory key) external view returns (uint256) {
    PriceFeed memory feed = priceFeeds[key];
    require(feed.isActive, 'Feed not active');
    return feed.price;
  }

  function getSupportedFeeds() external view returns (string[] memory) {
    return supportedFeeds;
  }

  function getPTYTRatio() external view returns (uint256 ratio) {
    uint256 ptPrice = priceFeeds['PT-wU2U/USD'].price;
    uint256 ytPrice = priceFeeds['YT-wU2U/USD'].price;
    require(ptPrice > 0 && ytPrice > 0, 'Invalid prices');
    return (ptPrice * 1e18) / ytPrice;
  }

  function emergencyRecover(address token, uint256 amount) external onlyOwner {
    if (token == address(0)) {
      payable(owner()).transfer(amount);
    } else {
      (bool success, ) = token.call(abi.encodeWithSignature('transfer(address,uint256)', owner(), amount));
      require(success, 'Transfer failed');
    }
  }
}
