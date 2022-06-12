const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async () => {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const market = await NFTMarket.deploy();
    await market.deployed();
    const marketAddress = market.address;
    
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    const nftContractAddress = nft.address;
    const listingPrice = await market.listingPrice();
    const auctionPrice = ethers.utils.parseUnits( 1, 'ether')
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    const [_, buyerAddresss] = await ethers.getSigner();

    await market.connect(buyerAddresss).createMarketSale(nftContractAddress, 1, {value: auctionPrice});
    let items = market.fetchMarketItem();
    console.log("items: ", items);
  });
});
