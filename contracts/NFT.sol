// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenId;
  address public contractAddress;
  constructor(address marketplaceAddress) ERC721("Metaverse Token", "MTT") {
    contractAddress = marketplaceAddress;
  }
  function createToken(string memory tokenURI) public returns (uint) {
    _tokenId.increment();
    uint256 newTokenId = _tokenId.current();
    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    setApprovalForAll(contractAddress, true);
    return newTokenId;
  }
}