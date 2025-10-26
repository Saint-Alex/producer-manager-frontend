import { formatCNPJ, formatCPF, generateId, validateCNPJ, validateCPF } from '../validators';

describe('validators', () => {
  describe('validateCPF', () => {
    it('should validate valid CPF', () => {
      // Using a valid CPF number that passes the algorithm
      expect(validateCPF('11144477735')).toBe(true);
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    it('should invalidate invalid CPF', () => {
      expect(validateCPF('')).toBe(false);
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('12345678900')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('invalid')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false); // Too many digits
    });

    it('should handle CPF with different formats', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('should reject repeated digits', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('22222222222')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should validate valid CNPJ', () => {
      // Using a valid CNPJ number that passes the algorithm
      expect(validateCNPJ('11222333000181')).toBe(true);
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });

    it('should invalidate invalid CNPJ', () => {
      expect(validateCNPJ('')).toBe(false);
      expect(validateCNPJ('123')).toBe(false);
      expect(validateCNPJ('11222333000180')).toBe(false);
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('invalid')).toBe(false);
      expect(validateCNPJ('123456789012345')).toBe(false); // Too many digits
    });

    it('should handle CNPJ with different formats', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('should reject repeated digits', () => {
      expect(validateCNPJ('11111111111111')).toBe(false);
      expect(validateCNPJ('22222222222222')).toBe(false);
      expect(validateCNPJ('00000000000000')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should handle partial CPF', () => {
      expect(formatCPF('123456')).toBe('123456');
      expect(formatCPF('')).toBe('');
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });

    it('should handle partial CNPJ', () => {
      expect(formatCNPJ('1122233')).toBe('1122233');
      expect(formatCNPJ('')).toBe('');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    it('should generate alphanumeric IDs', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate IDs with consistent length', () => {
      const ids = Array.from({ length: 10 }, () => generateId());
      const lengths = ids.map(id => id.length);

      // All IDs should have similar length (allowing some variation due to random generation)
      const minLength = Math.min(...lengths);
      const maxLength = Math.max(...lengths);
      expect(maxLength - minLength).toBeLessThanOrEqual(2);
    });
  });
});
