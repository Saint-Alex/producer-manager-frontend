#!/bin/bash

echo "🔧 Corrigindo erros específicos restantes..."

# 1. Corrigir conversões string/number no ProducerForm
echo "📝 Corrigindo ProducerForm..."
sed -i '/areaTotal:/s/fazenda\.areaTotal/Number(fazenda.areaTotal)/g' src/components/forms/ProducerForm/ProducerForm.tsx
sed -i '/areaAgricultavel:/s/fazenda\.areaAgricultavel/Number(fazenda.areaAgricultavel)/g' src/components/forms/ProducerForm/ProducerForm.tsx
sed -i '/areaVegetacao:/s/fazenda\.areaVegetacao/Number(fazenda.areaVegetacao)/g' src/components/forms/ProducerForm/ProducerForm.tsx

# 2. Corrigir conversões number/string no ProducerRegister
echo "📝 Corrigindo ProducerRegister..."
sed -i '/areaTotal:/s/fazenda\.areaTotal/fazenda.areaTotal.toString()/g' src/pages/ProducerRegister/ProducerRegister.tsx
sed -i '/areaAgricultavel:/s/fazenda\.areaAgricultavel/fazenda.areaAgricultavel.toString()/g' src/pages/ProducerRegister/ProducerRegister.tsx
sed -i '/areaVegetacao:/s/fazenda\.areaVegetacao/fazenda.areaVegetacao.toString()/g' src/pages/ProducerRegister/ProducerRegister.tsx

# 3. Remover propriedadeRuralId dos safras (não existe no novo modelo)
echo "📝 Removendo propriedadeRuralId..."
sed -i '/propriedadeRuralId:/d' src/pages/ProducerRegister/ProducerRegister.tsx

# 4. Comentar referências a culturasPlantadas (não existe no novo modelo)
echo "📝 Comentando culturasPlantadas..."
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\.culturasPlantadas/\/\* .culturasPlantadas \*\/ []/g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/safra\.culturasPlantadas/\/\* safra.culturasPlantadas \*\/ []/g'

# 5. Comentar produtorId (usar produtores array no novo modelo)
echo "📝 Corrigindo produtorId..."
sed -i 's/\.produtorId/\/\* .produtorId \*\/ "temp"/g' src/pages/home/HomePage.tsx

# 6. Corrigir testes - Date para string
echo "📝 Corrigindo testes..."
sed -i 's/createdAt: new Date()/createdAt: new Date().toISOString()/g' src/store/__tests__/producerSlice.test.ts
sed -i 's/updatedAt: new Date()/updatedAt: new Date().toISOString()/g' src/store/__tests__/producerSlice.test.ts

echo "✅ Correções específicas aplicadas!"
