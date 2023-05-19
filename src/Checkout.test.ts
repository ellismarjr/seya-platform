import { Checkout } from './Checkout';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductRepositoryDatabase } from './ProductRepositoryDatabase';
import { CouponRepositoryDatabase } from './CouponRepositoryDatabase';
import { ProductRepository } from './ProductRepository';
import { CouponRepository } from './CouponRepository';
// invalid cpf: 406.302.170-27

describe('Main', () => {
  let checkout: Checkout;
  beforeEach(() => {
    const products: any = {
      1: {
        idProduct: 1,
        description: 'A',
        price: 1000,
        width: 100,
        height: 30,
        length: 10,
        weight: 3
      },
      2: {
        idProduct: 2,
        description: 'B',
        price: 5000,
        width: 50,
        height: 50,
        length: 50,
        weight: 22
      },
      3: {
        idProduct: 3,
        description: 'C',
        price: 30,
        width: 10,
        height: 10,
        length: 10,
        weight: 0.9
      },
      4: {
        idProduct: 4,
        description: 'D',
        price: 30,
        width: -10,
        height: -10,
        length: -10,
        weight: 1
      },
      5: {
        idProduct: 5,
        description: 'E',
        price: 30,
        width: 10,
        height: 10,
        length: 10,
        weight: -1
      },
    }
    const productRepository: ProductRepository = {
      get: async (idProduct: number) => {
        return products[idProduct];
      }
    }

    const coupons: any = {
      'VALE20': {
        code: 'VALE20',
        percentage: 20,
        expire_date: new Date('2023-10-01T10:00:00')
      },
      'VALE10': {
        code: 'VALE10',
        percentage: 10,
        expire_date: new Date('2022-10-01T10:00:00')
      }
    }

    const couponRepository: CouponRepository = {
      get: async (code: string) => {
        return coupons[code];
      }
    }

    checkout = new Checkout(productRepository, couponRepository);
  });

  it('should NOT accept a order with invalid CPF', async () => {
    const input = {
      cpf: '406.302.170-27',
      items: []
    }

    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid CPF'));

  });

  it('should be able to create a empty order', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: []
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(0);
  });

  it('should be able to create a order with 3 products', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ]
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(6090);
  });

  it('should be able to create a order with 3 products and discount coupon', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE20',
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(4872);
  });

  it('should be able to create a order with 3 products and not apply expired coupon', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE10',
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(6090);
  });

  it('should be able to create a order with 3 products and coupon not exists', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE5',
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(6090);
  });

  it('should NOT be able to create a order with negative items quantity', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: -1 },
      ]
    }

    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid quantity'));
  });

  it('should NOT be able to create a order with duplicate items', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 1, quantity: 1 },
      ]
    }

    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Duplicated item'));
  });

  it('should be able to create a order with 3 products and calculate frete', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
      ],
      from: '88015600',
      to: "22030060"
    }

    const output = await checkout.execute(input);

    expect(output.subtotal).toBe(6000);
    expect(output.freight).toBe(250);
    expect(output.total).toBe(6250);
  });

  it('should be able to create a order with 3 products and calculate freight with minimun price', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      from: '88015600',
      to: "22030060"
    }

    const output = await checkout.execute(input);

    expect(output.subtotal).toBe(6090);
    expect(output.freight).toBe(280);
    expect(output.total).toBe(6370);
  });

  it('should NOT be able to create a order if he product has negative dimensions', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 4, quantity: 1 },
      ]
    }

    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid dimensions'));
  });

  it('should NOT be able to create a order if he product has negative weight', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 5, quantity: 1 },
      ]
    }

    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid weight'));
  });
});