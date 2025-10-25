# Code Quality & CI/CD Configuration

Este documento descreve a configuração das ferramentas de qualidade de código e
pipeline de CI/CD implementadas no projeto.

## 🛠️ Ferramentas Configuradas

### ESLint

- **Arquivo de configuração**: `.eslintrc.js`
- **Funcionalidade**: Análise estática de código para identificar problemas
- **Regras**: TypeScript, React, Prettier integration
- **Scripts disponíveis**:
  ```bash
  npm run lint          # Verificar problemas
  npm run lint:fix      # Corrigir problemas automaticamente
  ```

### Prettier

- **Arquivo de configuração**: `.prettierrc.js`
- **Funcionalidade**: Formatação automática de código
- **Configuração**: 2 espaços, single quotes, trailing commas
- **Scripts disponíveis**:
  ```bash
  npm run prettier       # Formatar todos os arquivos
  npm run prettier:check # Verificar formatação
  ```

### Husky

- **Diretório**: `.husky/`
- **Funcionalidade**: Git hooks para automação
- **Hooks configurados**:
  - **pre-commit**: Executa lint-staged
  - **pre-push**: Executa testes e type-check
  - **commit-msg**: Valida formato do commit

### Commitlint

- **Arquivo de configuração**: `.commitlintrc.js`
- **Funcionalidade**: Validação de mensagens de commit
- **Formato**: Conventional Commits
- **Tipos válidos**: feat, fix, docs, style, refactor, test, chore

### Lint-staged

- **Configuração**: `package.json`
- **Funcionalidade**: Executa linters apenas em arquivos staged
- **Ações**:
  - TypeScript/TSX: ESLint + Prettier
  - Outros arquivos: Prettier

## 🚀 Scripts NPM

### Desenvolvimento

```bash
npm start              # Inicia servidor de desenvolvimento
npm run dev            # Alias para npm start
npm test               # Executa testes
npm run test:watch     # Executa testes em modo watch
npm run test:coverage  # Executa testes com cobertura
```

### Qualidade de Código

```bash
npm run lint           # Executa ESLint
npm run lint:fix       # Corrige problemas do ESLint
npm run prettier       # Formata código com Prettier
npm run prettier:check # Verifica formatação
npm run type-check     # Verifica tipos TypeScript
npm run format         # Prettier + ESLint fix
npm run quality        # Type-check + Lint + Prettier check
npm run ci             # Pipeline completo (quality + test:coverage)
```

### Build

```bash
npm run build          # Build de produção
npm run build:analyze  # Build + análise de bundle
```

## 📋 GitHub Actions

### Workflow Principal (`ci.yml`)

#### Jobs Configurados:

1. **Quality Checks**
   - Matrix strategy (Node 18.x, 20.x)
   - Type checking
   - ESLint
   - Prettier check
   - Tests com cobertura
   - Upload para Codecov

2. **Build**
   - Dependente dos quality checks
   - Build da aplicação
   - Upload de artefatos

3. **Security Check**
   - Audit de segurança
   - Verificação de vulnerabilidades

4. **Deploy Staging**
   - Trigger: push para `develop`
   - Environment: staging
   - Deploy automático

5. **Deploy Production**
   - Trigger: push para `main`
   - Environment: production
   - Deploy automático

### Workflow de Dependências (`dependencies.yml`)

#### Jobs Configurados:

1. **Dependency Review**
   - Execução semanal (segunda-feira 2h UTC)
   - Review de dependências
   - Report de pacotes desatualizados

2. **License Check**
   - Verificação de compliance de licenças
   - Geração de relatórios

## 🔧 Configuração de Ambiente

### Requisitos

- Node.js 18.x ou 20.x
- NPM 9+
- Git 2.20+

### Setup Inicial

```bash
# Instalar dependências
npm ci

# Configurar Husky (automático no postinstall)
npm run prepare

# Verificar configuração
npm run quality
```

### Variáveis de Ambiente

Para CI/CD, configure as seguintes secrets no GitHub:

```bash
# Para deployment
AWS_ACCESS_KEY_ID      # Chaves AWS (se usando S3)
AWS_SECRET_ACCESS_KEY
AWS_REGION

# Para notificações
SLACK_WEBHOOK_URL      # Webhook do Slack
DISCORD_WEBHOOK_URL    # Webhook do Discord

# Para Codecov
CODECOV_TOKEN          # Token do Codecov
```

## 📊 Métricas de Qualidade

### Cobertura de Testes

- **Meta**: > 80%
- **Atual**: 80.99% (branch coverage)
- **Relatórios**: `coverage/lcov-report/index.html`

### Linting

- **Zero warnings** em produção
- **Auto-fix** disponível para a maioria dos problemas
- **Integração** com Prettier para formatação

### Type Safety

- **Strict mode** TypeScript habilitado
- **Type checking** em pre-push
- **Zero errors** de tipo em produção

## 🚫 Troubleshooting

### Problemas Comuns

1. **Husky hooks não executam**

   ```bash
   chmod +x .husky/*
   ```

2. **ESLint/Prettier conflitos**

   ```bash
   npm run format
   ```

3. **Tests falham no CI**

   ```bash
   npm run test:coverage
   ```

4. **Type errors**
   ```bash
   npm run type-check
   ```

### Reset da Configuração

```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Reconfigurar Husky
npm run prepare
```

## 📚 Recursos Adicionais

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Última atualização**: $(date +"%Y-%m-%d") **Versão das ferramentas**: ESLint
8.54, Prettier 3.6, Husky 9.1, TypeScript 5.2
