module.exports = {
  // Configuração Prettier para Producer Manager Frontend
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  bracketSpacing: true,
  bracketSameLine: false,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'preserve',
  rangeStart: 0,
  rangeEnd: Infinity,

  // Configurações específicas para diferentes tipos de arquivo
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        parser: 'yaml',
        tabWidth: 2,
      },
    },
  ],
};
