import { Coupon } from "../../domain/entities/Coupon";

export interface CouponRepository {
  get(code: string): Promise<Coupon | undefined>;
}