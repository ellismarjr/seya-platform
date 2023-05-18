import express, { Request, Response } from 'express';
import { validate } from './validator';

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

app.post('/checkout', (request: Request, response: Response) => {
  try {
    const output: Output = {
      subtotal: 0,
      total: 0,
      freight: 0
    };
    if (request.body.items) {
      for (const item of request.body.items) {
        if (item.quantity <= 0) {
          throw new Error('Invalid quantity');
        }
        if (request.body.items.filter((i: any) => i.idProduct === item.idProduct).length > 1) {
          throw new Error('Duplicated item');
        }
        const productData = products.filter(product => product.id === item.idProduct);
        if (productData[0].width <= 0 ||
          productData[0].height <= 0 ||
          productData[0].length <= 0) {
          throw new Error('Invalid dimensions');
        }
        if (productData[0].weight <= 0) {
          throw new Error('Invalid weight');
        }
        output.subtotal += productData[0].price * item.quantity;
        if (request.body.from && request.body.to) {
          const volume = productData[0].width / 100 * productData[0].height / 100 * productData[0].length / 100;
          const density = productData[0].weight / volume;
          let freight = volume * 1000 * (density / 100);
          freight = Math.max(freight, 10);
          output.freight += freight * item.quantity;
        }
      }
    }
    output.total = output.subtotal;
    if (request.body.coupon) {
      const couponData = coupons.find(coupon => coupon.code === request.body.coupon);
      const today = new Date();
      if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
        output.total -= output.total * (couponData.percentage / 100);
      }
    }
    const isValid = validate(request.body.cpf);
    if (!isValid) {
      output.message = 'Invalid CPF';
    }
    output.total += output.freight;
    response.json(output);
  } catch (error: any) {
    response.status(422).json({ message: error.message });
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