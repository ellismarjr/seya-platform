import { describe, expect, it } from "vitest";
import crypto from "crypto";
import { Coupon } from "../src/Coupon";
import { Order } from "../src/Order";
import { Product } from "../src/Product";

describe('Order', () => {
  it('should be able to create an empty order', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-16';
    const order = new Order(idOrder, cpf)
    expect(order.getTotal()).toBe(0);
  });

  it('should NOT be able to create an order with invalid cpf', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-15';
    expect(() => new Order(idOrder, cpf)).toThrow(new Error('Invalid CPF'));
  });

  it('should be able to create order with 3 items', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-16';
    const order = new Order(idOrder, cpf)
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1);
    order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1);
    order.addItem(new Product(3, 'C', 30, 50, 50, 50, 22), 3);
    expect(order.getTotal()).toBe(6090);
  });

  it('should be able to create order with 3 items', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-16';
    const order = new Order(idOrder, cpf)
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1);
    expect(() => order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1)).toThrow(new Error('Duplicated item'));
  });

  it('should be able to create an order and generate code', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-16';
    const order = new Order(idOrder, cpf, new Date("2023-03-01T10:00:00"), 1)
    expect(order.getTotal()).toBe(0);
    expect(order.code).toBe('202300000001');
  });

  it('should be able to create order with 3 items with discount', () => {
    const idOrder = crypto.randomUUID();
    const cpf = '503.348.770-16';
    const order = new Order(idOrder, cpf)
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3), 1);
    order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22), 1);
    order.addItem(new Product(3, 'C', 30, 50, 50, 50, 22), 3);
    order.addCoupon(new Coupon("VALE20", 20, new Date("2023-10-01T10:00:00")))
    expect(order.getTotal()).toBe(4872);
  });
}); 