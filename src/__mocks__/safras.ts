import { Safra } from '../types/safra';

export const mockSafras: Safra[] = [
  {
    id: '1',
    nome: 'Safra 2023/2024',
    ano: 2023,
    dataInicio: '2023-09-01T00:00:00Z',
    dataFim: '2024-08-31T00:00:00Z',
    cultivos: [
      {
        id: '1',
        areaPlantada: 100,
        cultura: {
          id: '1',
          nome: 'Soja',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        propriedadeRural: {
          id: '1',
          nomeFazenda: 'Fazenda Teste 1',
          cidade: 'Campinas',
          estado: 'SP',
          areaTotal: 1000,
          areaAgricultavel: 800,
          areaVegetacao: 200,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        safra: {} as any, // Circular reference
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        areaPlantada: 50,
        cultura: {
          id: '2',
          nome: 'Milho',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        propriedadeRural: {
          id: '1',
          nomeFazenda: 'Fazenda Teste 1',
          cidade: 'Campinas',
          estado: 'SP',
          areaTotal: 1000,
          areaAgricultavel: 800,
          areaVegetacao: 200,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        safra: {} as any, // Circular reference
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Safra 2022/2023',
    ano: 2022,
    dataInicio: '2022-09-01T00:00:00Z',
    dataFim: '2023-08-31T00:00:00Z',
    cultivos: [
      {
        id: '3',
        areaPlantada: 75,
        cultura: {
          id: '3',
          nome: 'Algodão',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        propriedadeRural: {
          id: '2',
          nomeFazenda: 'Fazenda Teste 2',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          areaTotal: 1500,
          areaAgricultavel: 1200,
          areaVegetacao: 300,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        safra: {} as any, // Circular reference
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];
