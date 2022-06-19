import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import {projectId} from '../projectId.json';

export default function Home() {
  const [nfts, setnfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${projectId}`);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();
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
        description: meta.data.description
      }
      return item;
    }));
    setnfts(items);
    setLoadingState('loaded');

  }
  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {value: price});
    await transaction.wait();
    loadNFTs();
  }
  if(loadingState === 'loaded' && !nfts.length) {
    return (
      <h1 className="px-20 py-20 text-3xl" >Not items in marketPlace</h1> 
    );
  }
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{maxWidth: '1600px' }} >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4" >
          {
            nfts.map((nft, index) => (
              <div key={index} className="border shadow rounded-xl overflow-hidden m-1" >
                <img className="object-cover" src={nft.image} />
                <div className="p-4" >
                  <p className="h-16 text-2xl font-semibold" >{nft.name}</p>
                  <div className="h-20 overflow-hidden" >
                    <p className="text-gray-400" >{nft.description}</p>
                  </div>
                  <div className="p-4 bg-black" >
                    <p className="text-2xl mb-4 font-bold text-white" >{nft.price} ETH</p>
                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)} >Buy Now</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}