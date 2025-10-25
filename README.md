# 🌾 Producer Manager Frontend

Interface React para gestão de produtores rurais com dashboard interativo e CRUD
completo.

## 🚀 Funcionalidades

- 👥 **Gestão de Produtores**: Cadastro, edição e exclusão com validação
  CPF/CNPJ
- 🏡 **Propriedades Rurais**: Controle de áreas (total, agricultável, vegetação)
- 🌾 **Safras e Culturas**: Sistema de tags para múltiplas culturas por safra
- 📊 **Dashboard Analítico**: Gráficos interativos de distribuição e uso do solo

## 🏗️ Tecnologias

- **React 18** + **TypeScript** - Interface moderna e tipada
- **Redux Toolkit** - Gerenciamento de estado
- **MUI X Charts** - Gráficos interativos
- **Styled Components** - Estilização componentizada
- **JSON Server** - API mock para desenvolvimento

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Conferir se o Producer Manager Backend foi iniciado (Terminal 1)
curl -X 'GET' \
  'http://localhost:3001/api' \
  -H 'accept: application/json'

# 3. Iniciar aplicação (Terminal 2)
npm start

# 4. Acessar o sistema
http://localhost:3000 (React App)
```

## 📱 Interface

### Dashboard Principal

- Estatísticas em tempo real (fazendas e hectares)
- Gráficos de pizza: distribuição por estado, culturas plantadas, uso do solo
- Lista de produtores com ações rápidas

### Gestão de Produtores

- Formulário integrado: dados pessoais + fazendas + safras
- Validação automática de CPF/CNPJ
- Edição completa na página dedicada da fazenda

### Análises Visuais

- Gráficos responsivos baseados em dados reais
- Filtros automáticos para relevância
- Interface otimizada para todos os dispositivos

## 🛠️ Scripts

```bash
npm start           # Desenvolvimento (porta 3000)
npm run build       # Build de produção
npm test            # Executar testes
npm run lint:check  # Verificar lint
```
