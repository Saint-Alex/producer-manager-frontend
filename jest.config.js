module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^styled-components$': '<rootDir>/src/__mocks__/styled-components.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
    // Arquivos de estilos (styled-components) - não contêm lógica de negócio testável
    '!src/**/*.styled.ts',
    '!src/**/*.styled.tsx',
    // Configurações e constantes estáticas
    '!src/styles/theme.ts',
    '!src/constants/index.ts',
    '!src/styled.d.ts',
    // Mocks e dados de teste
    '!src/__mocks__/**/*',
    '!src/**/__mocks__/**/*',
    // Arquivos de índice (re-exports)
    '!src/**/index.ts',
    '!src/**/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
