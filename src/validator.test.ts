import { describe, expect, it } from 'vitest';
import { validate } from './validator';

describe('Validator', () => {
  it.each([
    '407.302.170-27',
    '684.053.160-00',
    '746.971.314-01'
  ])('should be able to validate a valid CPF', (cpf) => {
    const isValid = validate(cpf);

    expect(isValid).toBeTruthy();
  });

  it.each([
    '406.302.170-27',
    '684.053.160',
    '684053160',
    '68405316026323728',
  ])('should be able to validate a invalid CPF', (cpf) => {
    const isValid = validate(cpf);

    expect(isValid).toBeFalsy();
  });

  it('should be able to validate a invalid CPF with all digits equals', () => {
    const isValid = validate('111.111.111-11');

    expect(isValid).toBeFalsy();
  });
});