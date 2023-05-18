import { Checkout } from './Checkout';
import { describe, expect, it } from 'vitest';
// invalid cpf: 406.302.170-27

describe('Main', () => {
  it('should NOT accept a order with invalid CPF', async () => {
    const input = {
      cpf: '406.302.170-27',
      items: []
    }

    const checkout = new Checkout();
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid CPF'));

  });

  it('should be able to create a empty order', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: []
    }

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
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

    const checkout = new Checkout();
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid dimensions'));
  });

  it('should NOT be able to create a order if he product has negative weight', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 5, quantity: 1 },
      ]
    }

    const checkout = new Checkout();
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid weight'));
  });
});