# Sistema de Cadastro de Produtores Rurais

Sistema simples para cadastro e gerenciamento de produtores rurais com uma pequena visualização de dashboard, gráficos interativos e CRUDS de produtores rurais, suas fazendas e culturas plantadas.

## 🚀 Funcionalidades Implementadas

### 👥 Gestão de Produtores
- ✅ **Cadastro completo** com validação de CPF/CNPJ
- ✅ **Listagem com resumo** das fazendas por produtor
- ✅ **Edição de dados** do produtor
- ✅ **Exclusão segura** com confirmação

### 🏡 Gestão de Fazendas
- ✅ **Cadastro de propriedades rurais** por produtor
- ✅ **Controle de áreas** (total, agricultável, vegetação)
- ✅ **Edição completa** de dados da fazenda
- ✅ **Visualização detalhada** com safras sempre visíveis

### 🌾 Sistema de Safras e Culturas
- ✅ **Múltiplas culturas por safra** (sistema de tags)
- ✅ **Cadastro por ano** com nome personalizado
- ✅ **Edição apenas na página da fazenda** (UX otimizada)
- ✅ **Visualização automática** nos cards das fazendas

### � Dashboard Analítico
- ✅ **Estatísticas em tempo real** (fazendas e hectares totais)
- ✅ **3 Gráficos de pizza interativos**:
  - 📍 **Distribuição por Estado**
  - 🌱 **Culturas Plantadas** (apenas as cadastradas)
  - 🏞️ **Uso do Solo** (agricultável vs vegetação)
- ✅ **Números dentro dos gráficos** em branco para máxima visibilidade
- ✅ **Dados filtrados e relevantes**

## 🏗️ Tecnologias

- **React 18** + **TypeScript** - Interface moderna e tipada
- **Redux Toolkit** - Gerenciamento de estado robusto
- **MUI X Charts** - Gráficos interativos profissionais
- **Styled Components** - Estilização component-based
- **JSON Server** - API REST para desenvolvimento
- **Webpack 5** - Build otimizado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar API (JSON Server) - Terminal 1
npm run api

# 3. Iniciar aplicação - Terminal 2  
npm start

# 4. Acessar o sistema
http://localhost:3000 (React App)
http://localhost:3001 (JSON Server API)
```

## 🎯 Fluxo de Uso

### 1. Dashboard Principal
- **Visão geral** com estatísticas e gráficos
- **Lista de produtores** com resumo das fazendas
- **Ações rápidas**: cadastrar, editar, excluir

### 2. Cadastro de Produtor
- **Dados pessoais** com validação de CPF/CNPJ
- **Fazendas integradas** no mesmo formulário
- **Safras com múltiplas culturas** (tags interativas)

### 3. Gestão de Fazendas
- **Visualização sempre ativa** das safras nos cards
- **Edição completa** na página dedicada da fazenda
- **Controle de áreas** com validação automática

### 4. Análises Visuais
- **Gráficos em tempo real** baseados nos dados cadastrados
- **Filtros automáticos** (apenas dados relevantes)
- **Interface responsiva** para todos os dispositivos

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── forms/ProducerForm/     # Formulário principal do produtor
│   └── shared/                 # Componentes reutilizáveis (modais, botões)
├── pages/
│   ├── home/                   # Dashboard com gráficos e estatísticas
│   ├── fazenda/                # Gestão de fazendas e safras
│   ├── propriedades/           # Listagem de propriedades por produtor
│   └── ProducerRegister/       # Cadastro de novos produtores
├── store/                      # Redux Toolkit
│   ├── producerSlice.ts        # Estado dos produtores
│   ├── propriedadeRuralSlice.ts # Estado das fazendas
│   └── safraSlice.ts           # Estado das safras
├── services/                   # APIs e integrações
├── types/                      # Definições TypeScript
└── utils/                      # Validadores e helpers
```

## 🛠️ Scripts Disponíveis

```bash
npm start           # Servidor de desenvolvimento (porta 3000)
npm run api         # JSON Server API (porta 3001)
npm run build       # Build de produção
npm test            # Executar testes
```
