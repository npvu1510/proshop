import express from 'express';

import products from './data/products.js';

const app = express();

app.get('/', (req, res) => {
  res.send(`<p>Hello World</p>`);
});

app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const product = products.find((product) => product._id === productId);

  if (!product)
    res.status(404).json({ status: 'failed', message: 'Not found' });
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export default app;
