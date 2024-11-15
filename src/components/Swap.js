import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { getAddress, userSession } from "../storage/userSession"
import axios from "axios";
import {
  SwapType,
  VelarSDK,
  getTokens,
  ISwapService,
  SwapResponse,
} from '@velarprotocol/velar-sdk';
import { openContractCall } from '@stacks/connect';
import { appIcon, appName, isTestnet } from "../Constants";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

function Swap(props) {
  const { address, isConnected } = props;
  const sdk = new VelarSDK();
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(4);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [swapInstance,setSwapInstance] = useState(null);
  const [convertedAmount,setConvertedAmount] = useState(0);
  
  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  async function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    const tokens = await getTokens()
    let swap = await sdk.getSwapInstance({
      account: getAddress(),
      inToken: tokenOne.symbol,
      outToken: tokenTwo.symbol
    });
  
    const amount = await swap.getComputedAmount({
      type: SwapType.ONE,
      amount: tokenOneAmount,
      slippage: slippage
    });
    
    setSwapInstance(swap);
    if (e.target.value && prices) {
      setTokenTwoAmount(amount.value.toFixed(3));
    } else {
      setTokenTwoAmount(null);
    }
  }
  const fetchExchangeRate = async()=>{
    setConvertedAmount(0);
    let swap = await sdk.getSwapInstance({
      account: getAddress(),
      inToken: tokenOne.symbol,
      outToken: tokenTwo.symbol
    });
  
    const amount = await swap.getComputedAmount({
      type: SwapType.ONE,
      amount: 1,
    });
    
    setConvertedAmount(amount.value.toFixed(3))
  }
  useEffect(()=>{
    console.log(`COnverting ${tokenOne.symbol} => ${tokenTwo.symbol}`)
    fetchExchangeRate()
  },[tokenOne,tokenTwo])

  async function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;

    
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.contractAddress, one.contractAddress);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].contractAddress, tokenTwo.contractAddress);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.contractAddress, tokenList[i].contractAddress);
    }
    setIsOpen(false);
  }

  async function fetchPrices(one, two) {
    const res = await axios.get(`https://api.velar.co/prices/${one}`);

    setPrices(res.data);
  }

  async function fetchDexSwap() {
    // const allowance = await axios.get(
    //   `https://api.1inch.io/v5.2/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    // );

    // if (allowance.data.allowance === "0") {
    //   const approve = await axios.get(
    //     `https://api.1inch.io/v5.2/1/approve/transaction?tokenAddress=${tokenOne.address}`
    //   );

    //   setTxDetails(approve.data);
    //   console.log("not approved");
    //   return;
    // }

    const swapOptions = await swapInstance.swap({
      amount: tokenOneAmount,
      type: SwapType.ONE,
    });

    const options = {
      ...swapOptions,
      network: isTestnet ? STACKS_TESTNET : STACKS_MAINNET,
      appDetails: {
        name: appName,
        icon: appIcon,
      },
      onFinish: data => { 
        messageApi.destroy();
        if (data) {
          messageApi.open({
            type: "loading",
            content: "Transaction is pending...",
            duration: 0,
          });
        }
      },
      onCancel: ex => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Transaction Failed",
          duration: 1.5,
        });
       },
    };


    await openContractCall(options);
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);



  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={4}>4.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a Token"
      >
        <div className="modelContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.imageUrl} alt={e.ticket} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.symbol}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="corg" />
          </Popover>
        </div>

        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.imageUrl} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.symbol}
            <DownOutlined />
          </div>
          
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.imageUrl} alt="assetTwoLogo" className="assetLogo" />
            {tokenTwo.symbol}
            <DownOutlined />
          </div>
          <div className="priceSection">
          <p className="price">1 {tokenOne.symbol} = {convertedAmount} {tokenTwo.symbol}</p>
          </div>
          
        </div>

        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={fetchDexSwap}
        >
          Swap
        </div>
        <div className="logoSection">
          <p>Powered By</p>
          <img src="https://velar.com/static/logo-099a44a980879c6b9ea66042dc4464e7.png" className="logoVelar"/>
        </div>
      </div>
    </>
  );
}

export default Swap;