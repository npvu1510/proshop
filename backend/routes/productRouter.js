import { Router } from 'express';

import { getProducts, getProduct } from '../controllers/productController.js';

const productRouter = Router();

productRouter.get('/products', getProducts);
productRouter.get('/products/:productId', getProduct);

export default productRouter;
