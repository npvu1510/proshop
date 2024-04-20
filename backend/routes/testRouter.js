import express from 'express';
import { testPaypal } from '../controllers/testController.js';

const testRouter = express.Router();

testRouter.route('/').get(testPaypal).post();
testRouter.route('/:id');

export default testRouter;
