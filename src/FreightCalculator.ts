import { Product } from "./Product";

export class FreightCalculator {
  static calculate(product: Product): number {
    const freight = product.getVolume() * 1000 * (product.getDensity() / 100);
    return Math.max(freight, 10);
  }
}