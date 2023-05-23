import { CouponRepository } from "../../application/repository/CouponRepository";
import { Coupon } from "../../domain/entities/Coupon";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly connection: DatabaseConnection) { }

  async get(code: string) {
    const [couponData] = await this.connection.query('SELECT * FROM cccat11.coupon WHERE code = $1', [code]);
    if (!couponData) return undefined;
    return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
  }
}