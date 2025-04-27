import React, { useState } from 'react';
import App.css from './App.css';

const ProductPage = () => {
  const productId = 'product123'; // You can make this dynamic
  const [openChat, setOpenChat] = useState(false);

  const startChat = () => {
    setOpenChat(true);
  };

  return (
    <div>
      <h2>Organic Tomatoes</h2>
      <p>Fresh farm tomatoes 🌱🍅</p>

      {!openChat && (
        <button onClick={startChat}>💬 Chat with Farmer</button>
      )}

      {openChat && (
        <ChatApp roomId={productId} userType="Buyer" />
      )}
    </div>
  );
};

export default ProductPage;
