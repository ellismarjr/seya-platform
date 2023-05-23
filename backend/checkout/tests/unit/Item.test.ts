import { describe, expect, it } from "vitest";
import { Product } from "../../src/domain/entities/Product";
import { Item } from "../../src/domain/entities/Item";

describe('Item', () => {
  it('should NOT be able to create an item with invalid quantity', () => {
    const product = new Product(1, "A", 1000, 100, 30, 10, 3);
    expect(() => new Item(product.idProduct, product.price, 0)).toThrow('Invalid quantity');
  });
});