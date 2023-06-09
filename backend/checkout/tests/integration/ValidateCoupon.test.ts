import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ValidateCoupon } from "../../src/application/usecase/ValidateCoupon";
import { DatabaseRepositoryFactory } from "../../src/infra/factory/DatabaseRepositoryFactory";
import { PgPromiseAdapter } from "../../src/infra/database/PgPromiseAdapter";
import { DatabaseConnection } from "../../src/infra/database/DatabaseConnection";

let validateCoupon: ValidateCoupon;
let connection: DatabaseConnection;

describe('ValidateCoupon', () => {
  beforeEach(async () => {
    connection = new PgPromiseAdapter();
    await connection.connect();
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    validateCoupon = new ValidateCoupon(repositoryFactory);
  })

  afterEach(async () => {
    await connection.close();
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