// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemSold;
  address payable owner;
  uint public listingPrice = 0.00025 ether;
  constructor() {
    owner = payable(msg.sender);
  }
  function getListingPrice() public view returns(string memory) {
    string memory listingPriceString = Strings.toString(listingPrice);
    return listingPriceString;
  }
  struct MarketItem {
    uint itemId;
    address nftContract;
    uint tokenId;
    address payable seller;
    address payable owner;
    uint price;
    bool sold;
  }
  mapping(uint => MarketItem) private MarketItemId;
  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint indexed tokenId,
    address seller,
    address owner,
    uint price,
    bool sold
  );
  function createMarketItem(
    address nftContract,
    uint tokenId,
    uint price
  ) public payable nonReentrant {
    require(price > 0, "Price should be atleast 1 wei");
    require(msg.value == listingPrice, "Price is not the listing price");
    _itemIds.increment();
    uint itemId = _itemIds.current();
    MarketItemId[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      address(0),
      price,
      false
    );
  }
  function createMarketSale(
    address nftContractAddress,
    uint itemId
  ) public payable nonReentrant {
    uint price = MarketItemId[itemId].price;
    uint tokenId = MarketItemId[itemId].tokenId;
    require(msg.value == price, "It's not the price");
    MarketItemId[itemId].seller.transfer(msg.value);
    IERC721(nftContractAddress).transferFrom(address(this), msg.sender, tokenId);
    MarketItemId[itemId].owner = payable(msg.sender);
    MarketItemId[itemId].sold = true;
    _itemSold.increment();
    payable(owner).transfer(listingPrice);
  }
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemSold.current();
    uint currentIndex = 0;
    MarketItem[] memory unsoldItems = new MarketItem[](unsoldItemCount);
    for(uint i = 1; i <= itemCount; i++) {
      if(MarketItemId[i].owner == address(0)) {
        uint currentItemId = MarketItemId[i].itemId;
        MarketItem memory curentItem = MarketItemId[currentItemId];
        unsoldItems[currentIndex] = curentItem;
        currentIndex++;
      }
    }
    return unsoldItems;
  }
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (MarketItemId[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (MarketItemId[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = MarketItemId[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
  }
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItems = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    for(uint i = 1; i <= totalItems; i++) {
      if(MarketItemId[i].seller == msg.sender) {
        itemCount++;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for(uint i = 1; i <= totalItems; i++) {
      if(MarketItemId[i].seller == msg.sender) {
        uint currentItemId = MarketItemId[i].itemId;
        items[currentIndex] = MarketItemId[currentItemId];
        currentIndex++;
      }
    }
    return items;
  }
}