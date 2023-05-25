import { Order } from "../src/entities/Order";

describe('Order', () => {
  it("should be able to create an order", () => {
    const order = new Order("1", "12345678900");
    order.addItem({ idProduct: 1, description: "A", price: 1000 });
    order.addItem({ idProduct: 1, description: "A", price: 1000 });
    order.addItem({ idProduct: 1, description: "A", price: 1000 });
    expect(order.getTotal()).toBe(3000);
    expect(order.items).toHaveLength(1);
  })
});