import {useState} from 'react';
import { ethers } from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketAddress } from "../config";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({name: '', discription: '', price: ''});
  const router = useRouter();

  const onChange = (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: prog => console.log(`Received: ${prog}`)
        }
      );
      const url = `http://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch(e) {
      console.log(e);
    }
  }
}
