import { ethers } from "ethers";
import axios from "axios";
import { useState, useEffect } from "react";
import Web3Modal from 'web3modal';
import { nftMarketAddress, nftAddress } from "../config";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import {projectId} from '../projectId.json';

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  },[]);
  const loadNFTs = async () => {
    const web3Modal = new Web3Modal(`https://eth-goerli.g.alchemy.com/v2/${projectId}`);
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    const data = await marketContract.fetchMyNFTs();
    //mapping
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
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
    setNfts(items);
    setLoadingState('loaded');
  }
  if(loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-20 text-3xl" >Your have no Assets</h1>
  );
  return(
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4" >
        {
            nfts.map((nft, index) => (
              <div key={index} className="border shadow rounded-xl overflow-hidden" >
                <img src={nft.image} />
                <div className="p-4" >
                  <p className="h-16 text-2xl font-semibold" >{nft.name}</p>
                  <div className="h-20 overflow-hidden" >
                    <p className="text-gray-400" >{nft.discription}</p>
                  </div>
                  <div className="p-4 bg-black" >
                    <p className="text-2xl mb-4 font-bold text-white" >{nft.price} ETH</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}