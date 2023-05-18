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

export const products: Product[] = [
  { id: 1, description: 'A', price: 1000, width: 100, height: 30, length: 10, weight: 3 },
  { id: 2, description: 'B', price: 5000, width: 50, height: 50, length: 50, weight: 22 },
  { id: 3, description: 'C', price: 30, width: 10, height: 10, length: 10, weight: 0.9 },
  { id: 4, description: 'D', price: 30, width: -10, height: -10, length: -10, weight: -1 },
  { id: 5, description: 'D', price: 30, width: 10, height: 10, length: 10, weight: -1 },
];

export const coupons: Coupon[] = [
  { percentage: 20, code: 'VALE20', expire_date: new Date('2023-10-01T10:00:00') },
  { percentage: 10, code: 'VALE10', expire_date: new Date('2022-10-01T10:00:00') },
];

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