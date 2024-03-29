import React from 'react';
import ReactDOM from 'react-dom/client';

import '../src/assets/styles/index.css';
import '../src/assets/styles/bootstrap.custom.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
