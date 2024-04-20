import asyncHandler from '../middleware/asyncHandler.js';
import AppError from './AppError.js';

const getPaypalToken = async () => {
  const auth = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`;
  const base64Auth = Buffer.from(auth).toString('base64');
  console.log(base64Auth);

  const endpoint = `${process.env.PAYPAL_URL}${process.env.PAYPAL_GET_TOKEN_ENDPOINT}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Auth}`,
      Accept: 'application/json',
      'Accept-Language': 'en_US',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new AppError(500, 'Something went wrong while paying');

  const { access_token = null } = await res.json();

  if (!access_token)
    throw new AppError(500, 'Something went wrong while paying');

  return access_token;
};

const checkIfNewTransaction = async (orderModel, transactionId) => {
  const transaction = await orderModel.findOne({
    'paymentResult.id': transactionId,
  });

  if (!transaction) return true;

  return false;
};

async function verifyPayPalPayment(paypalTransactionId) {
  const accessToken = await getPaypalToken();
  const paypalResponse = await fetch(
    `${process.env.PAYPAL_URL}/v2/checkout/orders/${paypalTransactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!paypalResponse.ok) throw new Error('Failed to verify payment');

  const paypalData = await paypalResponse.json();
  console.log(paypalData.purchase_units[0].amount);
  return {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value,
  };
}

export { getPaypalToken, checkIfNewTransaction, verifyPayPalPayment };
