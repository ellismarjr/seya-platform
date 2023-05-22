import { describe, expect, it } from "vitest";
import { Product } from "./Product";

describe('Product', () => {
  it('should calculate volume', () => {
    const product = new Product(1, "A", 1000, 100, 30, 10, 3);
    expect(product.getVolume()).toBe(0.03);
  });

  it('should calculate density', () => {
    const product = new Product(1, "A", 1000, 100, 30, 10, 3);
    expect(product.getDensity()).toBe(100);
  });

  it('should NOT be able to create product with invalid dimensions', () => {
    expect(() => new Product(1, "A", 1000, -100, -30, -10, 3)).toThrow('Invalid dimensions');
  });

  it('should NOT be able to create product with invalid weight', () => {
    expect(() => new Product(1, "A", 1000, 100, 30, 10, -3)).toThrow('Invalid weight');
  });
});