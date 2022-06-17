import {useState} from 'react';
import { ethers } from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketAddress } from "../config";
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const client = ipfsHttpClient('https://storageapi.fleek.co/54fddfbe-3408-4db0-9f6e-9171c5e1791b-bucket/');

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({name: '', discription: '', price: ''});
  const router = useRouter();
}
