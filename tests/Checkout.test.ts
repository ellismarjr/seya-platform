import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import sinon from 'sinon';
import crypto from 'crypto';
import { Checkout } from '../src/Checkout';
import { DatabaseConnection } from '../src/DatabaseConnection';
import { DatabaseRepositoryFactory } from '../src/DatabaseRepositoryFactory';
import { GetOrder } from '../src/GetOrder';
import { PgPromiseAdapter } from '../src/PgPromiseAdapter';
import { Product } from '../src/Product';
import { ProductRepositoryDatabase } from '../src/ProductRepositoryDatabase';
import { RepositoryFactory } from '../src/RepositoryFactory';



describe('Main', () => {
  let checkout: Checkout;
  let getOrder: GetOrder;
  let repositoryFactory: RepositoryFactory;
  let connection: DatabaseConnection;


  beforeEach(async () => {
    connection = new PgPromiseAdapter();
    await connection.connect();
    repositoryFactory = new DatabaseRepositoryFactory(connection);
    checkout = new Checkout(repositoryFactory);
    getOrder = new GetOrder(repositoryFactory);
  });

  afterEach(async () => {
    await connection.close();
  })

  it('should NOT accept a order with invalid CPF', async () => {
    const input = {
      cpf: '406.302.170-27',
      items: []
    }

    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid CPF'));

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

    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid quantity'));
  });

  it('should NOT be able to create a order with duplicate items', async () => {
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 1, quantity: 1 },
      ]
    }

    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Duplicated item'));
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

    expect(output.freight).toBe(220);
    expect(output.total).toBe(6220);
  });

  it('should be able to create a order with 3 products and calculate freight with minimum price', async () => {
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

    expect(output.freight).toBe(30);
    expect(output.total).toBe(6120);
  });

  // Test Pattern - Stub
  it('should be able to create a order with 1 item with stub', async () => {
    const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, 'get')
      .resolves(new Product(
        1, 'A', 1000, 1, 1, 1, 1
      ));

    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
      ]
    }

    const output = await checkout.execute(input);

    expect(output.total).toBe(1000);
    productRepositoryStub.restore();
  });

  it('should verify if email was sent with mock', async () => {
    const productRepositoryMock = sinon.mock(ProductRepositoryDatabase.prototype);
    productRepositoryMock.expects('get').once().resolves({
      idProduct: 1,
      description: 'A',
      price: 1000,
    });
    const input = {
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
      ],

    }

    const output = await checkout.execute(input);
    expect(output.total).toBe(1000);
    productRepositoryMock.verify();
  });

  it('should be able to create a order with 3 products and get save order', async () => {
    const idOrder = crypto.randomUUID();
    const input = {
      idOrder,
      cpf: '503.348.770-16',
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 },
      ]
    }

    await checkout.execute(input);
    const output = await getOrder.execute(idOrder);
    expect(output.total).toBe(6090);
  });

  it("should be able to create an order with 3 items and generate order code", async function () {
    const orderRepository = repositoryFactory.createOrderRepository();
    await orderRepository.clear();
    await checkout.execute({
      idOrder: crypto.randomUUID(),
      cpf: "407.302.170-27",
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 }
      ],
      email: "john.doe@gmail.com"
    });
    await checkout.execute({
      idOrder: crypto.randomUUID(),
      cpf: "407.302.170-27",
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 }
      ],
      email: "john.doe@gmail.com"
    });
    const idOrder = crypto.randomUUID();
    const input = {
      idOrder,
      cpf: "407.302.170-27",
      items: [
        { idProduct: 1, quantity: 1 },
        { idProduct: 2, quantity: 1 },
        { idProduct: 3, quantity: 3 }
      ],
      email: "john.doe@gmail.com",
      date: new Date("2022-01-01T10:00:00"),
      from: "88015600",
      to: "22030060"
    };
    await checkout.execute(input);
    const output = await getOrder.execute(idOrder);
    expect(output.code).toBe("202200000003");
  });
});