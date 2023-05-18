import axios from 'axios';

import { describe, expect, it } from 'vitest';

axios.defaults.validateStatus = () => true;

// invalid cpf: 406.302.170-27

describe('Main', () => {
  it('should NOT accept a order with invalid CPF', async () => {
    const input = {
      cpf: '406.302.170-27',
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.message).toBe('Invalid CPF');
  });

  it('should be able to create a empty order', async () => {
    const input = {
      cpf: '407.302.170-28',
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.total).toBe(0);
  });

  it('should be able to create a order with 3 products', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ]
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.total).toBe(6090);
  });

  it('should be able to create a order with 3 products and discount coupon', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE20',
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.total).toBe(4872);
  });

  it('should be able to create a order with 3 products and not apply expired coupon', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE10',
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.total).toBe(6090);
  });

  it('should be able to create a order with 3 products and coupon not exists', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      coupon: 'VALE5',
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.total).toBe(6090);
  });

  it('should NOT be able to create a order with negative items quantity', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: -1 },
      ]
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.message).toBe("Invalid quantity");
    expect(response.status).toBe(422);
  });

  it('should NOT be able to create a order with duplicate items', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 1, quantity: 1 },
      ]
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.message).toBe("Duplicated item");
    expect(response.status).toBe(422);
  });

  it('should be able to create a order with 3 products and calculate frete', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
      ],
      from: '88015600',
      to: "22030060"
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.subtotal).toBe(6000);
    expect(output.freight).toBe(250);
    expect(output.total).toBe(6250);
  });

  it('should be able to create a order with 3 products and calculate freight with minimun price', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ],
      from: '88015600',
      to: "22030060"
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.subtotal).toBe(6090);
    expect(output.freight).toBe(280);
    expect(output.total).toBe(6370);
  });

  it('should NOT be able to create a order if he product has negative dimensions', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 4, quantity: 1 },
      ]
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.message).toBe("Invalid dimensions");
    expect(response.status).toBe(422);
  });

  it('should NOT be able to create a order if he product has negative weight', async () => {
    const input = {
      cpf: '407.302.170-28',
      items: [
        { idProduct: 5, quantity: 1 },
      ]
    }

    const response = await axios.post('http://localhost:3333/checkout', input);
    const output = response.data;

    expect(output.message).toBe("Invalid weight");
    expect(response.status).toBe(422);
  });
});