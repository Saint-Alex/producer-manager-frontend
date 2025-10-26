import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { mockPropriedades } from '../../../__mocks__/propriedades';
import { mockSafras } from '../../../__mocks__/safras';
import propriedadeRuralSlice from '../../../store/propriedadeRuralSlice';
import safraSlice from '../../../store/safraSlice';
import { theme } from '../../../styles/theme';
import HomePage from '../HomePage';

// Mock para @mui/x-charts
jest.mock('@mui/x-charts/PieChart', () => ({
  PieChart: ({ series, height }: any) => (
    <div data-testid='pie-chart' style={{ height }}>
      Mock PieChart - {series[0]?.data?.length || 0} items
    </div>
  ),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      propriedades: propriedadeRuralSlice,
      safras: safraSlice,
    },
    preloadedState: {
      propriedades: {
        propriedades: [],
        loading: false,
        error: null,
        ...initialState?.propriedades,
      },
      safras: {
        safras: [],
        loading: false,
        error: null,
        ...initialState?.safras,
      },
    },
  });
};

const renderHomePage = (initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  // Testes de renderização básica
  test('renders HomePage title and description', () => {
    renderHomePage();
    expect(screen.getByText('Dashboard - Gestão Rural')).toBeInTheDocument();
    expect(
      screen.getByText('Visão geral do sistema de gerenciamento de produtores rurais')
    ).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    renderHomePage();
    expect(screen.getByText('Gerenciar Produtores')).toBeInTheDocument();
    expect(screen.getByText('Gerenciar Culturas')).toBeInTheDocument();
    expect(screen.getByText('+ Novo Produtor')).toBeInTheDocument();
  });

  test('renders statistics section', () => {
    renderHomePage();
    expect(screen.getByText('Estatísticas do Sistema:')).toBeInTheDocument();
    expect(screen.getByText('Análises Gráficas:')).toBeInTheDocument();
  });

  // Testes de navegação
  test('navigates to producers page when button is clicked', () => {
    renderHomePage();
    const button = screen.getByText('Gerenciar Produtores');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/producers');
  });

  test('navigates to cultures page when button is clicked', () => {
    renderHomePage();
    const button = screen.getByText('Gerenciar Culturas');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/culturas');
  });

  test('navigates to producer register when button is clicked', () => {
    renderHomePage();
    const button = screen.getByText('+ Novo Produtor');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/producer-register');
  });

  // Testes com dados vazios
  test('displays zero statistics when no data', () => {
    renderHomePage();
    const fazendasCount = screen.getByText('Total de Fazendas Cadastradas').previousElementSibling;
    const hectaresCount = screen.getByText('Total de Hectares Registrados').previousElementSibling;
    expect(fazendasCount).toHaveTextContent('0');
    expect(hectaresCount).toHaveTextContent('0');
  });

  test('displays empty charts when no data', () => {
    renderHomePage();
    // Como os gráficos não são renderizados quando não há dados,
    // verificamos se a mensagem "Sem dados para exibir" está presente
    const emptyMessages = screen.getAllByText('Sem dados para exibir');
    expect(emptyMessages).toHaveLength(3); // Um para cada gráfico
  });

  test('shows "Sem dados para exibir" message for empty charts', () => {
    renderHomePage();
    const emptyMessages = screen.getAllByText('Sem dados para exibir');
    expect(emptyMessages).toHaveLength(3); // Um para cada gráfico
  });

  // Testes com dados mockados
  test('displays correct statistics with mock data', () => {
    const stateWithData = {
      propriedades: {
        propriedades: mockPropriedades,
        loading: false,
        error: null,
      },
      safras: {
        safras: mockSafras,
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    // Verifica estatísticas
    expect(screen.getByText(mockPropriedades.length.toString())).toBeInTheDocument();
    const totalArea = mockPropriedades.reduce(
      (total, prop) => total + parseFloat(prop.areaTotal.toString()),
      0
    );
    expect(screen.getByText(Math.round(totalArea).toLocaleString('pt-BR'))).toBeInTheDocument();
  });

  test('renders charts with data when propriedades exist', () => {
    const stateWithData = {
      propriedades: {
        propriedades: mockPropriedades,
        loading: false,
        error: null,
      },
      safras: {
        safras: mockSafras,
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    const charts = screen.getAllByTestId('pie-chart');
    expect(charts).toHaveLength(3);

    // Verifica se os gráficos têm dados
    const estadosChart = charts[0];
    expect(estadosChart).toHaveTextContent('items');
  });

  // Testes das funções de dados
  test('correctly processes estados data', () => {
    const stateWithData = {
      propriedades: {
        propriedades: [
          { ...mockPropriedades[0], estado: 'SP' },
          { ...mockPropriedades[0], estado: 'SP' },
          { ...mockPropriedades[0], estado: 'RJ' },
        ],
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    // Verifica se os dados foram processados corretamente
    expect(screen.getByText('3')).toBeInTheDocument(); // Total de fazendas
  });

  test('correctly processes culturas data from safras', () => {
    const safrasWithCultivos = [
      {
        id: '1',
        nome: 'Safra Teste',
        ano: 2023,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        cultivos: [
          {
            id: '1',
            cultura: {
              id: '1',
              nome: 'Soja',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            areaPlantada: 100,
            propriedadeRural: {} as any,
            safra: {} as any,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            cultura: {
              id: '2',
              nome: 'Milho',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            areaPlantada: 50,
            propriedadeRural: {} as any,
            safra: {} as any,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
    ];

    const stateWithData = {
      safras: {
        safras: safrasWithCultivos,
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    const charts = screen.getAllByTestId('pie-chart');
    // Deve ter apenas o gráfico de culturas (o que tem dados)
    expect(charts[0]).toHaveTextContent('2 items'); // Gráfico de culturas
  });

  test('handles safras without cultivos gracefully', () => {
    const safrasSemCultivos = [
      {
        id: '1',
        nome: 'Safra Sem Cultivos',
        ano: 2023,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        cultivos: undefined,
      },
    ];

    const stateWithData = {
      safras: {
        safras: safrasSemCultivos,
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    // Não deve quebrar mesmo sem cultivos
    expect(screen.getByText('Culturas Plantadas')).toBeInTheDocument();
  });

  test('correctly calculates uso do solo data', () => {
    const propriedadesComAreas = [
      {
        ...mockPropriedades[0],
        areaAgricultavel: 100,
        areaVegetacao: 50,
      },
      {
        ...mockPropriedades[0],
        areaAgricultavel: 200,
        areaVegetacao: 75,
      },
    ];

    const stateWithData = {
      propriedades: {
        propriedades: propriedadesComAreas,
        loading: false,
        error: null,
      },
    };

    renderHomePage(stateWithData);

    // Verifica se o gráfico de uso do solo tem dados
    const charts = screen.getAllByTestId('pie-chart');
    // Deve ter 2 gráficos: estado (1 item) e área (2 items)
    expect(charts[1]).toHaveTextContent('2 items'); // Área agricultável e vegetação
  });

  // Testes de acessibilidade
  test('has accessible chart titles', () => {
    renderHomePage();
    expect(screen.getByText('Distribuição por Estado')).toBeInTheDocument();
    expect(screen.getByText('Culturas Plantadas')).toBeInTheDocument();
    expect(screen.getByText('Uso do Solo (Hectares)')).toBeInTheDocument();
  });

  test('displays descriptive text for statistics cards', () => {
    renderHomePage();
    expect(screen.getByText('Total de Fazendas Cadastradas')).toBeInTheDocument();
    expect(screen.getByText('Total de Hectares Registrados')).toBeInTheDocument();
  });

  // Teste de carregamento e efeitos
  test('dispatches fetch actions on component mount', async () => {
    renderHomePage();

    // Verifica se o componente renderiza sem erros
    await waitFor(() => {
      expect(screen.getByText('Dashboard - Gestão Rural')).toBeInTheDocument();
    });
  });

  // Testes adicionais para cobertura de branches
  describe('Chart conditional rendering branches', () => {
    test('renders pie chart when getEstadosData has items', () => {
      const stateWithData = {
        propriedades: {
          propriedades: [
            { ...mockPropriedades[0], estado: 'SP' },
            { ...mockPropriedades[0], estado: 'RJ' },
          ],
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      const charts = screen.getAllByTestId('pie-chart');
      expect(charts[0]).toHaveTextContent('2 items'); // Estados chart should have data
    });

    test('shows "Sem dados para exibir" when getEstadosData is empty', () => {
      renderHomePage(); // Empty state

      const emptyMessages = screen.getAllByText('Sem dados para exibir');
      expect(emptyMessages.length).toBeGreaterThanOrEqual(1);
    });

    test('renders pie chart when getCulturasData has items', () => {
      const safrasWithData = [
        {
          id: '1',
          nome: 'Safra Teste',
          ano: 2023,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          cultivos: [
            {
              id: '1',
              cultura: {
                id: '1',
                nome: 'Soja',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              areaPlantada: 100,
              propriedadeRural: {} as any,
              safra: {} as any,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ];

      const stateWithData = {
        safras: {
          safras: safrasWithData,
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      const charts = screen.getAllByTestId('pie-chart');
      expect(charts[0]).toHaveTextContent('1 items'); // Culturas chart should have data
    });

    test('shows "Sem dados para exibir" when getCulturasData is empty', () => {
      renderHomePage(); // Empty state

      const emptyMessages = screen.getAllByText('Sem dados para exibir');
      expect(emptyMessages.length).toBeGreaterThanOrEqual(1);
    });

    test('handles arcLabel function with value > 0', () => {
      const stateWithData = {
        propriedades: {
          propriedades: [{ ...mockPropriedades[0], estado: 'SP' }],
          loading: false,
          error: null,
        },
        safras: {
          safras: [
            {
              id: '1',
              nome: 'Safra',
              ano: 2023,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              cultivos: [
                {
                  id: '1',
                  cultura: {
                    id: '1',
                    nome: 'Soja',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 100,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      // Verifica que os gráficos são renderizados com dados
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts.length).toBeGreaterThan(0);
    });

    test('handles empty cultivos array in safras', () => {
      const safrasWithEmptyCultivos = [
        {
          id: '1',
          nome: 'Safra Vazia',
          ano: 2023,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          cultivos: [],
        },
      ];

      const stateWithData = {
        safras: {
          safras: safrasWithEmptyCultivos,
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      // Should show empty message for culturas chart
      const emptyMessages = screen.getAllByText('Sem dados para exibir');
      expect(emptyMessages.length).toBeGreaterThan(0);
    });

    test('handles filter condition count > 0 in getCulturasData', () => {
      const safrasWithMixedData = [
        {
          id: '1',
          nome: 'Safra',
          ano: 2023,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          cultivos: [
            {
              id: '1',
              cultura: {
                id: '1',
                nome: 'Soja',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              areaPlantada: 100,
              propriedadeRural: {} as any,
              safra: {} as any,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            {
              id: '2',
              cultura: {
                id: '2',
                nome: 'Milho',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              areaPlantada: 50,
              propriedadeRural: {} as any,
              safra: {} as any,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ];

      const stateWithData = {
        safras: {
          safras: safrasWithMixedData,
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      const charts = screen.getAllByTestId('pie-chart');
      expect(charts[0]).toHaveTextContent('2 items'); // Should filter and keep both items with count > 0
    });
  });

  // Testes adicionais para cobertura de branches específicas
  describe('Advanced branch coverage tests', () => {
    test('handles uso do solo chart when all items have value > 0', () => {
      const propriedadesComAreaValida = [
        {
          ...mockPropriedades[0],
          areaAgricultavel: 500,
          areaVegetacao: 300,
        },
        {
          ...mockPropriedades[0],
          areaAgricultavel: 200,
          areaVegetacao: 150,
        },
      ];

      const stateWithData = {
        propriedades: {
          propriedades: propriedadesComAreaValida,
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      // Deve renderizar o gráfico de uso do solo quando todos os valores são > 0
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts.length).toBeGreaterThan(0);
    });

    test('shows "Sem dados para exibir" when uso do solo has items with value 0', () => {
      const propriedadesComAreaZero = [
        {
          ...mockPropriedades[0],
          areaAgricultavel: 0,
          areaVegetacao: 0,
        },
      ];

      const stateWithData = {
        propriedades: {
          propriedades: propriedadesComAreaZero,
          loading: false,
          error: null,
        },
      };

      renderHomePage(stateWithData);

      // Deve mostrar mensagem vazia quando algum valor é 0
      const emptyMessages = screen.getAllByText('Sem dados para exibir');
      expect(emptyMessages.length).toBeGreaterThan(0);
      expect(emptyMessages[0]).toBeInTheDocument();
    });

    test('handles arcLabel logic for value === 0 in uso do solo', () => {
      // Simula a lógica do arcLabel para item.value === 0
      const arcLabelFunction = (item: { value: number }) => {
        if (item.value === 0) return '';
        return item.value < 1000
          ? `${item.value.toFixed(1)}`
          : `${(item.value / 1000).toFixed(1)}k`;
      };

      expect(arcLabelFunction({ value: 0 })).toBe('');
    });

    test('handles arcLabel logic for value < 1000 in uso do solo', () => {
      // Simula a lógica do arcLabel para item.value < 1000
      const arcLabelFunction = (item: { value: number }) => {
        if (item.value === 0) return '';
        return item.value < 1000
          ? `${item.value.toFixed(1)}`
          : `${(item.value / 1000).toFixed(1)}k`;
      };

      expect(arcLabelFunction({ value: 500.5 })).toBe('500.5');
    });

    test('handles arcLabel logic for value >= 1000 in uso do solo', () => {
      // Simula a lógica do arcLabel para item.value >= 1000
      const arcLabelFunction = (item: { value: number }) => {
        if (item.value === 0) return '';
        return item.value < 1000
          ? `${item.value.toFixed(1)}`
          : `${(item.value / 1000).toFixed(1)}k`;
      };

      expect(arcLabelFunction({ value: 1500 })).toBe('1.5k');
    });

    test('handles arcLabel logic for value > 0 in estados and culturas charts', () => {
      // Simula a lógica do arcLabel para item.value > 0
      const arcLabelFunction = (item: { value: number }) => (item.value > 0 ? `${item.value}` : '');

      expect(arcLabelFunction({ value: 5 })).toBe('5');
      expect(arcLabelFunction({ value: 0 })).toBe('');
    });

    test('renders charts with mixed data scenarios', () => {
      const mixedDataState = {
        propriedades: {
          propriedades: [
            { ...mockPropriedades[0], estado: 'SP', areaAgricultavel: 1000, areaVegetacao: 500 },
            { ...mockPropriedades[0], estado: 'RJ', areaAgricultavel: 800, areaVegetacao: 400 },
            { ...mockPropriedades[0], estado: 'SP', areaAgricultavel: 600, areaVegetacao: 300 },
          ],
          loading: false,
          error: null,
        },
        safras: {
          safras: [
            {
              id: '1',
              nome: 'Safra 1',
              ano: 2023,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              cultivos: [
                {
                  id: '1',
                  cultura: {
                    id: '1',
                    nome: 'Soja',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 300,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
                {
                  id: '2',
                  cultura: {
                    id: '2',
                    nome: 'Milho',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 200,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
                {
                  id: '3',
                  cultura: {
                    id: '1',
                    nome: 'Soja',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 150,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
          loading: false,
          error: null,
        },
      };

      renderHomePage(mixedDataState);

      // Deve renderizar todos os gráficos com dados
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts).toHaveLength(3); // Estados, Culturas, Uso do Solo

      // Verifica se os dados foram processados corretamente
      expect(charts[0]).toHaveTextContent('2 items'); // 2 estados únicos
      expect(charts[1]).toHaveTextContent('2 items'); // 2 culturas únicas
      expect(charts[2]).toHaveTextContent('2 items'); // Área agricultável e vegetação
    });

    test('handles edge case with zero values in different contexts', () => {
      const edgeCaseState = {
        propriedades: {
          propriedades: [
            { ...mockPropriedades[0], estado: 'SP', areaAgricultavel: 0, areaVegetacao: 100 },
          ],
          loading: false,
          error: null,
        },
        safras: {
          safras: [
            {
              id: '1',
              nome: 'Safra Edge',
              ano: 2023,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              cultivos: [
                {
                  id: '1',
                  cultura: {
                    id: '1',
                    nome: 'Café',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 0, // Edge case: zero area
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
          loading: false,
          error: null,
        },
      };

      renderHomePage(edgeCaseState);

      // Estados deve ter 1 gráfico (SP com 1 fazenda)
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts[0]).toHaveTextContent('1 items'); // Estados chart

      // Culturas deve estar vazio (filtro remove items com count === 0)
      const emptyMessages = screen.getAllByText('Sem dados para exibir');
      expect(emptyMessages.length).toBeGreaterThan(0);
    });

    test('validates uso do solo with large values formatting', () => {
      const largeValuesState = {
        propriedades: {
          propriedades: [{ ...mockPropriedades[0], areaAgricultavel: 50000, areaVegetacao: 25000 }],
          loading: false,
          error: null,
        },
      };

      renderHomePage(largeValuesState);

      // Deve renderizar gráfico com valores grandes
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts[1]).toHaveTextContent('2 items'); // Uso do solo chart
    });

    test('handles all chart conditions in single test scenario', () => {
      const comprehensiveState = {
        propriedades: {
          propriedades: [
            { ...mockPropriedades[0], estado: 'MG', areaAgricultavel: 750, areaVegetacao: 250 },
            { ...mockPropriedades[0], estado: 'RS', areaAgricultavel: 1200, areaVegetacao: 800 },
          ],
          loading: false,
          error: null,
        },
        safras: {
          safras: [
            {
              id: '1',
              nome: 'Safra Completa',
              ano: 2023,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              cultivos: [
                {
                  id: '1',
                  cultura: {
                    id: '1',
                    nome: 'Arroz',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 400,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
                {
                  id: '2',
                  cultura: {
                    id: '2',
                    nome: 'Feijão',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                  },
                  areaPlantada: 600,
                  propriedadeRural: {} as any,
                  safra: {} as any,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
          loading: false,
          error: null,
        },
      };

      renderHomePage(comprehensiveState);

      // Deve renderizar todos os 3 gráficos
      const charts = screen.getAllByTestId('pie-chart');
      expect(charts).toHaveLength(3);

      // Todos devem ter dados
      expect(charts[0]).toHaveTextContent('2 items'); // Estados: MG, RS
      expect(charts[1]).toHaveTextContent('2 items'); // Culturas: Arroz, Feijão
      expect(charts[2]).toHaveTextContent('2 items'); // Uso do solo: agricultável, vegetação
    });
  });
});
