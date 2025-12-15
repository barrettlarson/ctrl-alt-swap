import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Auth from './Auth.jsx';
import Checkout from './Checkout.jsx';
import Product from './Product.jsx';
import NewListing from './NewListing.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/app" element={<App />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product" element={<Product />} />
        <Route path="/new-listing" element={<NewListing />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);