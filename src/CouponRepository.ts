import { Coupon } from "./Coupon";

export interface CouponRepository {
  get(code: string): Promise<Coupon | undefined>;
}