import { describe, expect, it } from "vitest";
import { Cpf } from "../../src/domain/entities/Cpf";

describe('Cpf', () => {
  it.each([
    '407.302.170-27',
    '684.053.160-00',
    '746.971.314-01'
  ])('should be able to create a valid cpf', (cpf) => {
    expect(new Cpf(cpf)).toBeDefined();
  });

  it.each([
    '406.302.170-27',
    '684.053.160',
    '684053160',
    '68405316026323728',
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
  ])('should NOT be able to create an invalid cpf', (cpf) => {
    expect(() => new Cpf(cpf)).toThrow(new Error('Invalid CPF'));
  });
}); 