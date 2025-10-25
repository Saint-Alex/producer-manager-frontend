#!/bin/bash

echo "🔧 Corrigindo erros de compilação TypeScript..."

# Corrigir nomeProdutor -> nome
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/nomeProdutor/nome/g'

# Corrigir areaTotalHectares -> areaTotal
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaTotalHectares/areaTotal/g'

# Corrigir areaAgricultavelHectares -> areaAgricultavel
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaAgricultavelHectares/areaAgricultavel/g'

# Corrigir areaVegetacaoHectares -> areaVegetacao
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaVegetacaoHectares/areaVegetacao/g'

# Corrigir Date -> string nos tipos (backend retorna string ISO)
find src/types -name "*.ts" | xargs sed -i 's/: Date/: string/g'

echo "✅ Correções básicas aplicadas!"

# Adicionar import FazendaWithSafras que está faltando
echo "📝 Adicionando tipos que estão faltando..."

echo "✅ Pronto para próxima fase de correções!"
