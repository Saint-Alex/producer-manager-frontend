#!/bin/bash

# Producer Manager Frontend - Deploy Script para Heroku
echo "🚀 Iniciando deploy do Producer Manager Frontend..."

# Verifica se está logado no Heroku
if ! heroku whoami >/dev/null 2>&1; then
    echo "❌ Erro: Você precisa estar logado no Heroku CLI"
    echo "Execute: heroku login"
    exit 1
fi

# Verifica se o app existe
APP_NAME=${1:-producer-manager-frontend}
echo "📱 Verificando app: $APP_NAME"

if ! heroku apps:info $APP_NAME >/dev/null 2>&1; then
    echo "🆕 App não encontrado. Criando novo app: $APP_NAME"
    heroku create $APP_NAME

    if [ $? -ne 0 ]; then
        echo "❌ Erro ao criar app. Tente um nome diferente:"
        echo "bash deploy.sh seu-nome-unico-app"
        exit 1
    fi
fi

# Configura variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."

# Verifica se REACT_APP_API_URL foi fornecida
if [ -z "$2" ]; then
    echo "⚠️  REACT_APP_API_URL não fornecida. Usando URL padrão..."
    echo "Para especificar a URL da API, use:"
    echo "bash deploy.sh $APP_NAME https://seu-backend.herokuapp.com"

    # Usa URL padrão baseada no nome do app
    API_URL="https://producer-manager-backend.herokuapp.com"
else
    API_URL="$2"
fi

heroku config:set NODE_ENV=production -a $APP_NAME
heroku config:set REACT_APP_API_URL=$API_URL -a $APP_NAME

echo "✅ Variáveis configuradas:"
echo "   NODE_ENV=production"
echo "   REACT_APP_API_URL=$API_URL"

# Executa testes antes do deploy
echo "🧪 Executando testes..."
npm test -- --watchAll=false --coverage=false

if [ $? -ne 0 ]; then
    echo "❌ Testes falharam. Deploy cancelado."
    exit 1
fi

# Adiciona remote do Heroku se não existir
if ! git remote | grep -q heroku; then
    echo "🔗 Adicionando remote do Heroku..."
    heroku git:remote -a $APP_NAME
fi

# Deploy
echo "🚀 Fazendo deploy para o Heroku..."
git push heroku main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deploy concluído com sucesso!"
    echo "📱 Aplicação disponível em: https://$APP_NAME.herokuapp.com"
    echo "📊 Logs: heroku logs --tail -a $APP_NAME"
    echo "⚙️  Config vars: heroku config -a $APP_NAME"

    # Abre a aplicação
    echo "🌐 Abrindo aplicação..."
    heroku open -a $APP_NAME
else
    echo "❌ Erro no deploy. Verifique os logs:"
    echo "heroku logs --tail -a $APP_NAME"
    exit 1
fi
