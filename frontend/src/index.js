import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import './assets/styles/bootstrap.custom.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import App from './App';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Test from './pages/Test';

import store from './store';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import ProtectRoute from './components/ProtectRoute';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';

import { HelmetProvider } from 'react-helmet-async';

import GlobalStyles from './GlobalStyles';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* PUBLIC ROUTE */}
      <Route index element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetail />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* FOR USER ROUTE */}
      <Route path="" element={<ProtectRoute />}>
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />

        <Route path="/place-order" element={<PlaceOrder />} />

        <Route path="/order/:id" element={<Order />} />

        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* FOR ADMIN ROUTE */}
      <Route path="" element={<ProtectRoute forAdmin={true} />}>
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/users" element={<Users />} />
      </Route>

      <Route path="/test" element={<Test />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <HelmetProvider>
    <GlobalStyles />
    <PayPalScriptProvider deferLoading={true}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </PayPalScriptProvider>
  </HelmetProvider>
  // </React.StrictMode>
);
