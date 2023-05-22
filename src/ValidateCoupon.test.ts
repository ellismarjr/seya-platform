import { describe, expect, it } from "vitest";
import { CouponRepositoryDatabase } from "./CouponRepositoryDatabase";
import { ValidateCoupon } from "./ValidateCoupon";

describe('ValidateCoupon', () => {
  it('should be able to validate a valid coupon', async () => {
    const input = "VALE20";
    const couponRepository = new CouponRepositoryDatabase();
    const validateCoupon = new ValidateCoupon(couponRepository);
    const output = await validateCoupon.execute(input);
    expect(output.isValid).toBe(true);
  });

  it('should be able to validate a expired coupon', async () => {
    const input = "VALE10";
    const couponRepository = new CouponRepositoryDatabase();
    const validateCoupon = new ValidateCoupon(couponRepository);
    const output = await validateCoupon.execute(input);
    expect(output.isValid).toBe(false);
  });
});