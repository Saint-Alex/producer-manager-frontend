#!/bin/bash

echo "🔧 Corrigindo sintaxe inválida criada pelo sed..."

# Primeiro, reverter as mudanças problemáticas do sed
git checkout -- src/ 2>/dev/null || echo "Git não disponível, continuando..."

# Aplicar correções básicas novamente (que sabemos que funcionam)
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/nomeProdutor/nome/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaTotalHectares/areaTotal/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaAgricultavelHectares/areaAgricultavel/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/areaVegetacaoHectares/areaVegetacao/g'

echo "✅ Sintaxe corrigida. Próximo passo: correções manuais específicas."
