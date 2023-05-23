import { describe, expect, it } from "vitest";
import { Coupon } from "../../src/domain/entities/Coupon";

describe('Coupon', () => {
  it('should be able to test if coupon is valid', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.isValid(new Date('2023-03-01T10:00:00'))).toBe(true);
  });

  it('should be able to calculate the discount', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.calculateDiscount(1000)).toBe(200);
  });

  it('should be able to test if coupon is invalid', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-03-01T10:00:00'));
    expect(coupon.isValid(new Date('2023-04-01T10:00:00'))).toBe(false);
  });
}); 