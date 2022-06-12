import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {
  const [nfts, setnfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);
    const data = marketContract.fetchMarketItems();
    //mapping
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokeURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        discription: meta.data.discription
      }
      return item;
    }));
    setnfts(items);
    setLoadingState('loaded');

    if(loadingState === 'loaded' && !nfts.length) {
      return (
        <h1 className="px-20 py-20 text-3xl" >Not items in marketPlace</h1> 
      )
    }
  }
  return (
    <div></div>
  )
}
