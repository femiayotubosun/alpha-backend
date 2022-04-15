import { PaystackDto } from './dto/paystack.dto';
import axios from 'axios';

const PaystackClient = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: 'Bearer sk_test_89ab90ebfc20e656e10de4102b41162de0bccfe9',
    'Content-Type': 'application/json',
  },
});

export async function payWithPaystack(paystackDto: PaystackDto) {
  console.log('we here');
  const resp = await PaystackClient.get('/transaction/initialize');
  return resp.data;
}
export class MyStuff {}
