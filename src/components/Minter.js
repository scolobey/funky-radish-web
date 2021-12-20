import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'
import { ethers } from "ethers";

import { setRedirect, warning } from "../actions/Actions";

import { Helmet } from "react-helmet";

import { ColorPicker } from 'react-color-gradient-picker';
import 'react-color-gradient-picker/dist/index.css';

import myRecipeNFT from '../utils/MyRecipeNFT.json'

const color = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 0.9,
};

const CONTRACT_ADDRESS = "0x30f8034472CA947eFbdeB21f35Db172BBab2E428";

export default function Minter(props) {

  const redirector = useSelector((state) => state.redirect)
  const dispatch = useDispatch()

  const [ image, setImage ] = React.useState('')
  const [ pickerOpened, setPickerOpened ] = React.useState(false)
  const [ colorAttrs, setColorAttrs] = useState(color);
  const [ currentAccount, setCurrentAccount] = useState("");
  const [ miningInProgress, setMiningInProgress ] = React.useState(false)

  const onChange = (colorAttributes) => {
    setColorAttrs(colorAttributes);
    const regex = /height="100%" fill=".*"\/>/gm;
    console.log("initial image: " + image)
    console.log("color: " + colorAttributes.style)
    let newImage = image.replace(regex, 'height="100%" fill="' + colorAttributes.style + '"/>')
    console.log("newImage: " + newImage)
    setImage(newImage)
    console.log("changing color: " + image)
  };

  const onClick = () => {
    setPickerOpened(!pickerOpened)
  };

  const createNFT = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      dispatch(warning("Go get Metamask!"))
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()

      let correctNetwork = await checkNetwork()
      if (correctNetwork) {
        askContractToMintNft()
      }
      else {
        dispatch(warning("You're not connected to Rinkeby."))
      }
    } else {
      console.log("No authorized account found")
      connectWallet()
    }
  };

  const connectWallet = async () => {
    try {
      console.log("connecting wallet")
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener()

      let correctNetwork = await checkNetwork()
      if (correctNetwork) {
        askContractToMintNft()
      }
      else {
        dispatch(warning("You're not connected to Rinkeby."))
      }
    } catch (error) {
      dispatch(warning("error: " + console.error()))
    }
  };

  const checkNetwork = async () => {
    const { ethereum } = window;

    let chainId = await ethereum.request({ method: 'eth_chainId' });

    // String, hex code of the chainId of the Rinkebey test network
    // Main network = "0x1"
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return false
    }
    else {
      return true
    }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myRecipeNFT.abi, signer);

        // This will "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewRecipeNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("event listener registered!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    setMiningInProgress(true)

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myRecipeNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let finalImage = image.replace('</svg>', '<text font-size="40"><tspan x="1650" y="1000">')
        console.log("minting: " + finalImage)
        let nftTxn = await connectedContract.makeARecipeNFT(finalImage);

        console.log("Mining...please wait.")
        await nftTxn.wait();

        setMiningInProgress(false)

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        setMiningInProgress(false)
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMiningInProgress(false)
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("using effect")

    if (!image || image.length < 1) {
      let initialImage = localStorage.getItem('mint_image');
      if (initialImage.length < 1) {
        setImage('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"> <rect x="0" y="0" width="100%" height="100%" fill="' + colorAttrs.style + '/><text fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="60" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">1920×1080</text></svg>')
      }
      else {
        setImage(initialImage);
      }
    }

  });

  return (
    <div className="minter">
      <div className="svg_preview">
        Preview:
        <img width='840' height='530' src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`} />

        <div className="tools">
          <button className="background_color_button" onClick={onClick} >Adjust Background Color</button>
          { image && <button className="minter_button" onClick={createNFT} >Mint</button> }
          <a className='view_collection_button' href="https://testnets.opensea.io/collection/recipenft-tnl92pdxif">Checkout The Full Collection!</a>

          { pickerOpened &&
            <div className="picker">
              <ColorPicker
                onStartChange={onChange}
                onChange={onChange}
                onEndChange={onChange}
                color={colorAttrs}
              />
            </div>
          }
        </div>
      </div>
      { miningInProgress &&
        <div className="mining_in_progress">
          <iframe src="https://giphy.com/embed/6fDQ3k4IOqnEA" width="960" height="620" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/mining-stages-6fDQ3k4IOqnEA">via GIPHY</a></p>
        </div>
      }
    </div>
  );
}
