import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, generateId } from '../validators';

describe('Validators', () => {
  describe('validateCPF', () => {
    test('should validate correct CPF', () => {
      expect(validateCPF('11144477735')).toBe(true);
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    test('should reject invalid CPF', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('12345678901')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    test('should validate correct CNPJ', () => {
      expect(validateCNPJ('11222333000181')).toBe(true);
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    test('should reject invalid CNPJ', () => {
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('123456789012')).toBe(false);
      expect(validateCNPJ('12345678901234')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    test('should format CPF correctly', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });
  });

  describe('formatCNPJ', () => {
    test('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});
