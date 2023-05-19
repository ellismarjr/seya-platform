export interface CouponRepository {
  get(code: string): Promise<any>;
}