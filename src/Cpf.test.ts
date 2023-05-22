import { describe, expect, it } from "vitest";
import { Cpf } from "./Cpf";

describe('Cpf', () => {
  it('should be able to create a valid cpf', () => {
    const cpf = new Cpf('503.348.770-16');
    expect(cpf).toBeDefined();
  });

  it('should NOT be able to create an invalid cpf', () => {
    expect(() => new Cpf('503.348.770-15')).toThrow(new Error('Invalid CPF'));
  });
}); 