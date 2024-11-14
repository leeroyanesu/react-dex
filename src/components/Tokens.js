import React, { useEffect, useState } from "react";
import tokenList from "../tokenList.json";
import {getTokens} from "@velarprotocol/velar-sdk"

function Tokens() {
  const [tokens,setToken] = useState([]);
  const fetchData = async () => {
    try {
     
      
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div>
      <h2>Available Tokens</h2>
      <div className="token-list">
        {tokenList.map((token, index) => (
          <div key={index} className="token-item">
            <img
              src={token.imageUrl}
              alt={token.ticker}
              className="token-image-small"
            />
            <div className="token-info">
              <div className="token-name">{token.name}</div>
              <div className="token-ticker">( {token.symbol} )</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tokens;
