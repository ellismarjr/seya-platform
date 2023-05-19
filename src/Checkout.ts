import { validateCpf } from "./validator";
import { ProductRepository } from "./ProductRepository";
import { CouponRepository } from "./CouponRepository";

export class Checkout {
  constructor(
    readonly productRepository: ProductRepository,
    readonly couponRepository: CouponRepository
  ) { }

  async execute(input: Input): Promise<Output> {
    const output = {
      subtotal: 0,
      total: 0,
      freight: 0
    };
    try {
      const isValid = validateCpf(input.cpf);
      if (isValid) {
        if (input.items) {
          for (const item of input.items) {
            if (item.quantity <= 0) throw new Error('Invalid quantity')
            if (input.items.filter((i: any) => i.idProduct === item.idProduct).length > 1) throw new Error('Duplicated item');
            const productData = await this.productRepository.get(item.idProduct);
            if (productData.width <= 0 ||
              productData.height <= 0 ||
              productData.length <= 0) {
              throw new Error('Invalid dimensions');
            }
            if (productData.weight <= 0) throw new Error('Invalid weight');
            output.subtotal += productData.price * item.quantity;
            if (input.from && input.to) {
              const volume = productData.width / 100 * productData.height / 100 * productData.length / 100;
              const density = productData.weight / volume;
              let freight = volume * 1000 * (density / 100);
              freight = Math.max(freight, 10);
              output.freight += freight * item.quantity;
            }
          }
        }
        output.total = output.subtotal;
        if (input.coupon) {

          const today = new Date();
          const couponData = await this.couponRepository.get(input.coupon);
          if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
            output.total -= output.total * (couponData.percentage / 100);
          }
        }
        output.total += output.freight;
        return output;
      } else {
        throw new Error('Invalid CPF');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

type Items = {
  idProduct: number;
  quantity: number;
}

type Input = {
  cpf: string;
  items: Items[];
  from?: string;
  to?: string;
  coupon?: string;
}

type Output = {
  subtotal: number;
  total: number;
  freight: number;
}