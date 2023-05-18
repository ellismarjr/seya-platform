import express, { Request, Response } from 'express';
import { Checkout } from './Checkout';

interface Product {
  id: number;
  description: string;
  price: number;
  width: number;
  height: number;
  length: number;
  weight: number;
}

interface Coupon {
  percentage: number;
  code: string;
  expire_date: Date;
}

const app = express();

app.use(express.json());

app.post('/checkout', async (request: Request, response: Response) => {
  const checkout = new Checkout();

  try {
    const output = await checkout.execute(request.body)
    return response.json(output);
  } catch (error: any) {
    return response.status(422).json({ message: error.message });
  }
});

export type Output = {
  subtotal: number;
  total: number;
  freight: number;
  message?: string;
}

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});