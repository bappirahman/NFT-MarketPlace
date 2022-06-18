import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function creatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  useEffect(() => {
    loadNfts();
  }, []);
  const loadNfts = async () => {
    const web3Modal = new Web3Modal();
    const connection = web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMyNFTs();
    //mapping
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokeURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          discription: meta.data.discription,
        };
        return item;
      })
    );
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
  };
  return (
    <div>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {nfts.map((nft, index) => (
              <div
                key={index}
                className="border shadow rounded-xl overflow-hidden"
              >
                <img src={nft.image} />
                <div className="p-4">
                  <p className="h-16 text-2xl font-semibold">{nft.name}</p>
                  <div className="h-20 overflow-hidden">
                    <p className="text-gray-400">{nft.discription}</p>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl mb-4 font-bold text-white">
                      {nft.price} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4">
          {
            sold.length && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4">
                {sold.map((nft, index) => (
              <div
                key={index}
                className="border shadow rounded-xl overflow-hidden"
              >
                <img src={nft.image} />
                <div className="p-4">
                  <p className="h-16 text-2xl font-semibold">{nft.name}</p>
                  <div className="h-20 overflow-hidden">
                    <p className="text-gray-400">{nft.discription}</p>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl mb-4 font-bold text-white">
                      {nft.price} ETH
                    </p>
                  </div>
                </div>
              </div>
            ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
