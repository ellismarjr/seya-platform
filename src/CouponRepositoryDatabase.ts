import pgPromise from "pg-promise";
import { CouponRepository } from "./CouponRepository";

export class CouponRepositoryDatabase implements CouponRepository {
  async get(code: string) {
    const connection = pgPromise()("postgres://postgres:123456@localhost:5432/app")
    const [couponData] = await connection.query('SELECT * FROM cccat11.coupon WHERE code = $1', code);
    await connection.$pool.end();
    return couponData;
  }
}