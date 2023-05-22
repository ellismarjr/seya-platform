import { beforeEach, describe, expect, it } from "vitest";
import { CouponRepositoryDatabase } from "./CouponRepositoryDatabase";
import { ValidateCoupon } from "./ValidateCoupon";
import { DatabaseRepositoryFactory } from "./DatabaseRepositoryFactory";

let validateCoupon: ValidateCoupon;


describe('ValidateCoupon', () => {
  beforeEach(() => {
    const repositoryFactory = new DatabaseRepositoryFactory();
    validateCoupon = new ValidateCoupon(repositoryFactory);
  })

  it('should be able to validate a valid coupon', async () => {
    const input = "VALE20";
    const output = await validateCoupon.execute(input);
    expect(output.isValid).toBe(true);
  });

  it('should be able to validate a expired coupon', async () => {
    const input = "VALE10";
    const output = await validateCoupon.execute(input);
    expect(output.isValid).toBe(false);
  });
});