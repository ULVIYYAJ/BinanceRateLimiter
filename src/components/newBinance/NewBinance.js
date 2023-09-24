import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { w3cwebsocket as WebSocket } from 'websocket';
 
const API_KEY = process.env.REACT_APP_API_KEY;
const API_SECRET = process.env.REACT_APP_API_SECRET;

const NewBinance = () => {
  const [btcusdt, setBtcusdt] = useState({});

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onopen = () => {
      console.log('connected');
    };

    ws.onclose = () => {
      console.log('disconnected');
    };

    ws.onmessage = (data) => {
      let dataObject = JSON.parse(data.data);
      console.log(dataObject);
      setBtcusdt(dataObject);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ margin: '1em', padding: '1em', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p>Symbol: {btcusdt.s}</p>
          <p>Price: {btcusdt.p}</p>
          <p>Quantity: {btcusdt.q}</p>
        </div>
      </div>
    </div>
  );
};

const newOrder = async (symbol, quantity, side) => {
  try {
    console.log(`Attempting to ${side} ${quantity} ${symbol}`);
    const orderData = {
      symbol,
      quantity,
      side,
      type: 'MARKET',
      timestamp: Date.now(),
    };
    const queryString = Object.keys(orderData).map(key => `${key}=${orderData[key]}`).join('&');
    const signature = CryptoJS.HmacSHA256(queryString, API_SECRET).toString(CryptoJS.enc.Hex);
    const headers = {
      'X-MBX-APIKEY': API_KEY,
    };
    const response = await axios.post(`http://localhost:8080/https://api.binance.com/api/v3/order?${queryString}&signature=${signature}`, {}, { headers });
    console.log('Order response:', response.data);

    return response.data;
  } catch (error) {
    console.log('An error occurred:', error);
  }
};

export default NewBinance;



