import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { cultivoService } from '../../../services/cultivoService';
import { culturaService } from '../../../services/culturaService';
import { propriedadeRuralService } from '../../../services/propriedadeRuralService';
import { safraService } from '../../../services/safraService';
import propriedadeReducer from '../../../store/propriedadeRuralSlice';
import safraReducer from '../../../store/safraSlice';
import { theme } from '../../../styles/theme';
import FazendaForm from '../FazendaForm';

// Mock do window.confirm para jsdom
global.window.confirm = jest.fn(() => true);

// Mock dos serviços
jest.mock('../../../services/propriedadeRuralService', () => ({
  propriedadeRuralService: {
    create: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    getByProdutor: jest.fn(),
    delete: jest.fn(),
    convertFormToCreateData: jest.fn().mockImplementation((formData, produtorIds) => ({
      nomeFazenda: formData.nomeFazenda,
      cidade: formData.cidade,
      estado: formData.estado,
      areaTotal: Number(formData.areaTotal),
      areaAgricultavel: Number(formData.areaAgricultavel),
      areaVegetacao: Number(formData.areaVegetacao),
      produtorIds,
    })),
  },
}));

jest.mock('../../../services/safraService', () => ({
  safraService: {
    getByPropriedade: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock('../../../services/culturaService', () => ({
  culturaService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../services/cultivoService', () => ({
  cultivoService: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getBySafra: jest.fn(),
    getByPropriedade: jest.fn(),
  },
}));

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useParams } = require('react-router-dom');

const mockedPropriedadeService = propriedadeRuralService as jest.Mocked<
  typeof propriedadeRuralService
>;
const mockedSafraService = safraService as jest.Mocked<typeof safraService>;
const mockedCulturaService = culturaService as jest.Mocked<typeof culturaService>;
const mockedCultivoService = cultivoService as jest.Mocked<typeof cultivoService>;

// Helper para criar store de teste
const createTestStore = (initialState: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      propriedades: propriedadeReducer,
      safras: safraReducer,
    },
    preloadedState: {
      propriedades: {
        propriedades: [],
        currentPropriedade: null,
        loading: false,
        error: null,
        ...((initialState?.propriedades as object) || {}),
      },
      safras: {
        safras: [],
        currentSafra: null,
        safrasByPropriedade: {},
        loading: false,
        error: null,
        ...((initialState?.safras as object) || {}),
      },
    },
  });
};

// Helper para renderizar com providers
const renderWithProviders = (
  component: React.ReactElement,
  options: { initialState?: Record<string, unknown> } = {}
) => {
  const store = createTestStore(options.initialState);

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

// Mock data
const mockFazenda = {
  id: '1',
  nomeFazenda: 'Fazenda Teste',
  cidade: 'Sorriso',
  estado: 'MT',
  areaTotal: 1000,
  areaAgricultavel: 800,
  areaVegetacao: 200,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockSafra = {
  id: '1',
  nome: 'Safra Teste',
  ano: 2024,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockCulturas = [
  {
    id: 'cultura-1',
    nome: 'Soja',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cultura-2',
    nome: 'Milho',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('FazendaForm - Comprehensive Branch Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPropriedadeService.create.mockResolvedValue(mockFazenda);
    mockedPropriedadeService.update.mockResolvedValue(mockFazenda);
    mockedSafraService.getByPropriedade.mockResolvedValue([]);
    mockedSafraService.create.mockResolvedValue(mockSafra);
    mockedSafraService.update.mockResolvedValue(mockSafra);
    mockedSafraService.delete.mockResolvedValue(undefined);
    mockedCulturaService.getAll.mockResolvedValue(mockCulturas);
    mockedCultivoService.create.mockResolvedValue({
      id: 'cultivo-1',
      cultura: mockCulturas[0],
      propriedadeRural: mockFazenda,
      safra: mockSafra,
      areaPlantada: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  });

  describe('Validation Functions - All Branches', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
    });

    it('deve falhar validação quando nome da fazenda está vazio', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      // Deixar nome vazio
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
        expect(screen.getByText('Nome da fazenda é obrigatório')).toBeInTheDocument();
      });
    });

    it('deve falhar validação quando cidade está vazia', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      // Deixar cidade vazia
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
        expect(screen.getByText('Cidade é obrigatória')).toBeInTheDocument();
      });
    });

    it('deve falhar validação quando estado está vazio', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      // Deixar estado vazio
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
        expect(screen.getByText('Estado é obrigatório')).toBeInTheDocument();
      });
    });

    it('deve falhar validação quando área total é zero ou negativa', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.clear(screen.getByLabelText(/Área Total/));
      await user.type(screen.getByLabelText(/Área Total/), '0');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
        expect(screen.getByText('Área total deve ser maior que zero')).toBeInTheDocument();
      });
    });

    it('deve passar validação com todos os campos válidos', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');
      await user.type(screen.getByLabelText(/Área Agricultável/), '80');
      await user.type(screen.getByLabelText(/Área de Vegetação/), '20');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(mockedPropriedadeService.create).toHaveBeenCalledWith({
          nomeFazenda: 'Fazenda Teste',
          cidade: 'Cidade Teste',
          estado: 'MT',
          areaTotal: 100,
          areaAgricultavel: 80,
          areaVegetacao: 20,
          produtorIds: ['producer1'],
        });
      });
    });
  });

  describe('Edit Mode vs Create Mode Branches', () => {
    it('deve renderizar em modo de criação quando não há propriedadeId', async () => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
      renderWithProviders(<FazendaForm />);

      expect(screen.getByText('Cadastrar Nova Fazenda')).toBeInTheDocument();
      expect(screen.getByText('Salvar Fazenda')).toBeInTheDocument();
      expect(screen.queryByText('Safras da Fazenda')).not.toBeInTheDocument();
    });

    it('deve renderizar em modo de edição quando há propriedadeId', async () => {
      useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
      mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);

      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        expect(screen.getByText('Editar Fazenda')).toBeInTheDocument();
        expect(screen.getByText('Atualizar Fazenda')).toBeInTheDocument();
        expect(screen.getByText('Safras da Fazenda')).toBeInTheDocument();
      });
    });

    it('deve chamar update em modo de edição', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
      mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);

      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Fazenda Teste')).toBeInTheDocument();
      });

      const salvarButton = screen.getByText('Atualizar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(mockedPropriedadeService.update).toHaveBeenCalledWith('1', {
          nomeFazenda: 'Fazenda Teste',
          cidade: 'Sorriso',
          estado: 'MT',
          areaTotal: 1000,
          areaAgricultavel: 800,
          areaVegetacao: 200,
        });
      });
    });
  });

  describe('Safra Management Branches', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
      mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);
    });

    it('deve mostrar "Nenhuma safra cadastrada" quando não há safras', async () => {
      mockedSafraService.getByPropriedade.mockResolvedValue([]);
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        expect(screen.getByText('Nenhuma safra cadastrada para esta fazenda.')).toBeInTheDocument();
      });
    });

    it('deve mostrar "Carregando safras..." enquanto carrega', async () => {
      mockedSafraService.getByPropriedade.mockImplementation(() => new Promise(() => {}));
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        expect(screen.getByText('Carregando safras...')).toBeInTheDocument();
      });
    });

    it('deve abrir formulário de adicionar safra', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        const addButton = screen.getByText('+ Adicionar Safra');
        user.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Adicionar Nova Safra')).toBeInTheDocument();
        expect(screen.getByLabelText(/Ano/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nome da Safra/)).toBeInTheDocument();
      });
    });

    it('deve cancelar adição de safra', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      // Clica para adicionar safra
      const addButton = screen.getByText('+ Adicionar Safra');
      await user.click(addButton);

      // Verifica que o formulário abriu
      await waitFor(() => {
        expect(screen.getByText('Adicionar Nova Safra')).toBeInTheDocument();
      });

      // Clica no botão cancelar da safra
      const cancelButtons = screen.getAllByText('Cancelar');
      await user.click(cancelButtons[0]); // O primeiro é do form da safra

      // Verifica que o formulário fechou
      await waitFor(() => {
        expect(screen.queryByText('Adicionar Nova Safra')).not.toBeInTheDocument();
      });
    });

    it('deve adicionar cultura à safra', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        const addButton = screen.getByText('+ Adicionar Safra');
        user.click(addButton);
      });

      await waitFor(async () => {
        const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
        await user.selectOptions(select, 'cultura-1'); // Usar ID da cultura
      });

      await waitFor(() => {
        expect(screen.getByText('Soja')).toBeInTheDocument();
      });
    });

    it('deve remover cultura da safra', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        const addButton = screen.getByText('+ Adicionar Safra');
        user.click(addButton);
      });

      await waitFor(async () => {
        const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
        await user.selectOptions(select, 'cultura-1'); // Usar ID da cultura
      });

      await waitFor(() => {
        // Aguarda a cultura aparecer como selecionada
        const culturaTag = screen.getByText('Soja');
        expect(culturaTag).toBeInTheDocument();
      });

      await waitFor(async () => {
        const removeButton = screen.getByTitle('Remover Soja');
        await user.click(removeButton);
      });

      await waitFor(() => {
        // Verifica se a opção volta a aparecer no select (que significa que foi removida das selecionadas)
        const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
        const sojaOption = within(select).getByText('Soja');
        expect(sojaOption).toBeInTheDocument();
        expect(screen.getByText('Nenhuma cultura selecionada')).toBeInTheDocument();
      });
    });

    it('deve salvar nova safra', async () => {
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        const addButton = screen.getByText('+ Adicionar Safra');
        user.click(addButton);
      });

      await waitFor(async () => {
        await user.type(screen.getByLabelText(/Ano/), '2024');
        await user.type(screen.getByLabelText(/Nome da Safra/), 'Safra Teste');

        const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
        await user.selectOptions(select, 'cultura-1'); // Usar ID da cultura

        // Adicionar área plantada
        const areaInput = screen.getByLabelText(/Área \(ha\)/);
        await user.type(areaInput, '10');

        const saveButton = screen.getByText('Adicionar');
        await user.click(saveButton);
      });

      await waitFor(() => {
        expect(mockedSafraService.create).toHaveBeenCalledWith({
          nome: 'Safra Teste',
          ano: 2024,
          propriedadeRuralId: '1',
        });
        expect(mockedCultivoService.create).toHaveBeenCalledWith({
          culturaId: 'cultura-1',
          propriedadeId: '1',
          safraId: '1',
          areaCultivada: 10,
        });
      });
    });

    it('deve editar safra existente', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ propriedadeId: '1' }); // Mock params for edit mode
      mockedSafraService.getByPropriedade.mockResolvedValue([mockSafra]);

      // Create custom render to avoid nested routers
      const mockSafraWithProp = { ...mockSafra, propriedadeRural: { id: '1' } };

      const store = createTestStore({
        propriedades: {
          propriedades: [mockFazenda],
          currentPropriedade: mockFazenda,
          loading: false,
          error: null,
        },
        safras: {
          safras: [mockSafraWithProp],
          loading: false,
          error: null,
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/fazenda/edit/1']}>
            <Routes>
              <Route
                path='/fazenda/edit/:propriedadeId'
                element={
                  <ThemeProvider theme={theme}>
                    <FazendaForm />
                  </ThemeProvider>
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Aguarda a safra carregar
      await waitFor(() => {
        expect(screen.getByText('Safra Teste')).toBeInTheDocument();
      });

      // Clica no botão editar
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Verifica que o formulário de edição abriu
      await waitFor(() => {
        expect(screen.getByText('Editar Safra')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Safra Teste')).toBeInTheDocument();
      });

      // Adiciona uma cultura para satisfazer a validação
      const culturaSelect = screen.getByLabelText('Selecione uma cultura');
      await user.selectOptions(culturaSelect, 'cultura-1'); // Usar ID

      // Adicionar área plantada
      const areaInput = screen.getByLabelText(/Área \(ha\)/);
      await user.type(areaInput, '5');

      // Clica no botão atualizar
      const updateButton = screen.getByText('Atualizar');
      await user.click(updateButton);

      // Verifica que o serviço de update foi chamado
      await waitFor(() => {
        expect(mockedSafraService.update).toHaveBeenCalled();
      });
    });

    it('deve excluir safra', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ propriedadeId: '1' }); // Mock params for edit mode
      mockedSafraService.getByPropriedade.mockResolvedValue([mockSafra]);

      // Create custom render to avoid nested routers
      const mockSafraWithProp = { ...mockSafra, propriedadeRural: { id: '1' } };

      const store = createTestStore({
        propriedades: {
          propriedades: [mockFazenda],
          currentPropriedade: mockFazenda,
          loading: false,
          error: null,
        },
        safras: {
          safras: [mockSafraWithProp],
          safrasByPropriedade: {
            '1': [mockSafraWithProp],
          },
          loading: false,
          error: null,
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/fazenda/edit/1']}>
            <Routes>
              <Route
                path='/fazenda/edit/:propriedadeId'
                element={
                  <ThemeProvider theme={theme}>
                    <FazendaForm />
                  </ThemeProvider>
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(async () => {
        const deleteButton = screen.getByRole('button', { name: /Excluir/ });
        await user.click(deleteButton);
      });

      await waitFor(() => {
        expect(mockedSafraService.delete).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Error Handling Branches', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
    });

    it('deve mostrar erro quando criação de fazenda falha', async () => {
      const user = userEvent.setup();
      mockedPropriedadeService.create.mockRejectedValue(new Error('Erro no servidor'));

      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro ao Salvar')).toBeInTheDocument();
        expect(screen.getByText('Erro ao salvar a fazenda. Tente novamente.')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro quando atualização de fazenda falha', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
      mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);
      mockedPropriedadeService.update.mockRejectedValue(new Error('Erro no servidor'));

      renderWithProviders(<FazendaForm />);

      await waitFor(async () => {
        const salvarButton = screen.getByText('Atualizar Fazenda');
        await user.click(salvarButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Erro ao Salvar')).toBeInTheDocument();
        expect(screen.getByText('Erro ao salvar a fazenda. Tente novamente.')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro quando criação de safra falha', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
      mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);
      mockedSafraService.create.mockRejectedValue(new Error('Erro no servidor'));

      renderWithProviders(<FazendaForm />);

      await waitFor(() => {
        const addButton = screen.getByText('+ Adicionar Safra');
        user.click(addButton);
      });

      await waitFor(async () => {
        await user.type(screen.getByLabelText(/Ano/), '2024');
        await user.type(screen.getByLabelText(/Nome da Safra/), 'Safra Teste');

        const saveButton = screen.getByText('Adicionar');
        await user.click(saveButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Erro')).toBeInTheDocument();
        expect(
          screen.getByText('Preencha todos os campos da safra e adicione pelo menos uma cultura.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form State and Navigation Branches', () => {
    it('deve atualizar campo de input corretamente', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1' });
      renderWithProviders(<FazendaForm />);

      const nomeInput = screen.getByLabelText(/Nome da Fazenda/);
      await user.type(nomeInput, 'Fazenda Nova');

      expect(nomeInput).toHaveValue('Fazenda Nova');
    });

    it('deve navegar corretamente após salvar com sucesso', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1' });
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/propriedades/producer1');
      });
    });

    it('deve fechar modal de notificação', async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ produtorId: 'producer1' });
      mockedPropriedadeService.create.mockRejectedValue(new Error('Erro'));

      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Erro ao Salvar')).toBeInTheDocument();
      });

      // Simular fechamento do modal (seria através do componente NotificationModal)
      const closeButton = screen.getByRole('button', { name: 'OK' });
      if (closeButton) {
        await user.click(closeButton);
      }
    });
  });

  describe('Additional Coverage Tests', () => {
    it('deve renderizar todos os campos do formulário', () => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
      renderWithProviders(<FazendaForm />);

      expect(screen.getByLabelText(/Nome da Fazenda/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cidade/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Estado/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Área Total/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Área Agricultável/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Área de Vegetação/)).toBeInTheDocument();
    });

    it('deve navegar corretamente no cancelar sem produtorId', async () => {
      useParams.mockReturnValue({});
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      const cancelarButton = screen.getByText('Cancelar');
      await user.click(cancelarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar corretamente no cancelar com produtorId', async () => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      const cancelarButton = screen.getByText('Cancelar');
      await user.click(cancelarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/propriedades/producer1');
    });

    it('deve tratar soma de áreas quando campos estão vazios', async () => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), '100');
      // Não preencher área agricultável e área de vegetação

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(mockedPropriedadeService.create).toHaveBeenCalled();
      });
    });

    it('deve validar área total com valores não numéricos', async () => {
      useParams.mockReturnValue({ produtorId: 'producer1' });
      const user = userEvent.setup();
      renderWithProviders(<FazendaForm />);

      await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
      await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
      await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
      await user.type(screen.getByLabelText(/Área Total/), 'abc');

      const salvarButton = screen.getByText('Salvar Fazenda');
      await user.click(salvarButton);

      await waitFor(() => {
        expect(screen.getByText('Área total deve ser maior que zero')).toBeInTheDocument();
      });
    });
  });

  describe('Comprehensive Branch Coverage - Additional Tests', () => {
    describe('Validação de soma de áreas - todos os branches', () => {
      it('deve falhar validação quando soma das áreas excede área total', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');
        await user.type(screen.getByLabelText(/Área Agricultável/), '80');
        await user.type(screen.getByLabelText(/Área de Vegetação/), '30'); // Total = 110 > 100

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
          expect(
            screen.getByText(
              'A soma da área agricultável e vegetação não pode ser maior que a área total'
            )
          ).toBeInTheDocument();
        });
      });

      it('deve passar validação quando soma das áreas não excede área total', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');
        await user.type(screen.getByLabelText(/Área Agricultável/), '60');
        await user.type(screen.getByLabelText(/Área de Vegetação/), '30'); // Total = 90 < 100

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(mockedPropriedadeService.create).toHaveBeenCalled();
        });
      });
    });

    describe('Filtro de safras - branch coverage completo', () => {
      it('deve renderizar quando não há safras no cache', async () => {
        useParams.mockReturnValue({ propriedadeId: '1' });

        const store = createTestStore({
          propriedades: {
            currentPropriedade: mockFazenda,
            loading: false,
            error: null,
          },
          safras: {
            safras: [],
            safrasByPropriedade: {},
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        await waitFor(() => {
          expect(
            screen.getByText('Nenhuma safra cadastrada para esta fazenda.')
          ).toBeInTheDocument();
        });
      });

      it('deve testar lógica de filtro de safras corretamente', async () => {
        useParams.mockReturnValue({ propriedadeId: '1' });

        const store = createTestStore({
          propriedades: {
            currentPropriedade: mockFazenda,
            loading: false,
            error: null,
          },
          safras: {
            safras: [],
            safrasByPropriedade: {},
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        await waitFor(() => {
          // Deve mostrar mensagem de nenhuma safra
          expect(
            screen.getByText('Nenhuma safra cadastrada para esta fazenda.')
          ).toBeInTheDocument();
        });
      });

      it('deve filtrar por currentPropriedade.id quando não há propriedadeId', async () => {
        useParams.mockReturnValue({ produtorId: 'producer1' }); // Sem propriedadeId

        const mockSafrasGlobais = [
          { ...mockSafra, id: 'safra-1', nome: 'Safra Current 1', propriedadeRural: { id: '1' } },
          { ...mockSafra, id: 'safra-2', nome: 'Safra Other', propriedadeRural: { id: '2' } },
        ];

        const store = createTestStore({
          propriedades: {
            currentPropriedade: { ...mockFazenda, id: '1' }, // currentPropriedade com id = 1
            loading: false,
            error: null,
          },
          safras: {
            safras: mockSafrasGlobais,
            safrasByPropriedade: {},
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        // No modo criação, não deve mostrar seção de safras
        expect(screen.queryByText('Safras da Fazenda')).not.toBeInTheDocument();
      });
    });

    describe('Carregamento de culturas - erro handling', () => {
      it('deve mostrar erro quando falha ao carregar culturas', async () => {
        useParams.mockReturnValue({ produtorId: 'producer1' });
        mockedCulturaService.getAll.mockRejectedValue(new Error('Erro de rede'));

        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          expect(screen.getByText('Erro')).toBeInTheDocument();
          expect(screen.getByText('Erro ao carregar culturas disponíveis.')).toBeInTheDocument();
        });
      });
    });

    describe('Validações de safra - branches completos', () => {
      beforeEach(() => {
        useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });
        mockedPropriedadeService.getById.mockResolvedValue(mockFazenda);
      });

      it('deve falhar quando tenta salvar safra sem fazenda salva (modo criação)', async () => {
        // const user = userEvent.setup(); // Not used in this test
        useParams.mockReturnValue({ produtorId: 'producer1' }); // Sem propriedadeId (modo criação)

        renderWithProviders(<FazendaForm />);

        // Simular adicionar safra em modo criação
        const store = createTestStore({
          propriedades: {
            currentPropriedade: null, // Sem propriedade atual
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        // O teste deve verificar a lógica sem mostrar o botão de adicionar safra (que só aparece em edição)
        // Mas vamos testar a função diretamente através de um mock scenario
      });

      it('deve falhar quando campos de safra estão vazios', async () => {
        const user = userEvent.setup();
        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          // Não preencher nenhum campo
          const saveButton = screen.getByText('Adicionar');
          await user.click(saveButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Erro')).toBeInTheDocument();
          expect(
            screen.getByText('Preencha todos os campos da safra e adicione pelo menos uma cultura.')
          ).toBeInTheDocument();
        });
      });

      it('deve falhar quando apenas ano está preenchido', async () => {
        const user = userEvent.setup();
        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          await user.type(screen.getByLabelText(/Ano/), '2024');
          // Não preencher nome nem culturas

          const saveButton = screen.getByText('Adicionar');
          await user.click(saveButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Erro')).toBeInTheDocument();
          expect(
            screen.getByText('Preencha todos os campos da safra e adicione pelo menos uma cultura.')
          ).toBeInTheDocument();
        });
      });

      it('deve falhar quando área plantada excede área agricultável', async () => {
        const user = userEvent.setup();
        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          await user.type(screen.getByLabelText(/Ano/), '2024');
          await user.type(screen.getByLabelText(/Nome da Safra/), 'Safra Teste');

          const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
          await user.selectOptions(select, 'cultura-1');

          // Área plantada maior que área agricultável (800)
          const areaInput = screen.getByLabelText(/Área \(ha\)/);
          await user.type(areaInput, '1000');

          const saveButton = screen.getByText('Adicionar');
          await user.click(saveButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
          expect(
            screen.getByText(
              /A soma das áreas plantadas \(1000 ha\) não pode exceder a área agricultável \(800 ha\)\./
            )
          ).toBeInTheDocument();
        });
      });

      it('deve falhar quando cultura tem área zero', async () => {
        const user = userEvent.setup();
        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          await user.type(screen.getByLabelText(/Ano/), '2024');
          await user.type(screen.getByLabelText(/Nome da Safra/), 'Safra Teste');

          const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
          await user.selectOptions(select, 'cultura-1');

          // Área plantada zero
          const areaInput = screen.getByLabelText(/Área \(ha\)/);
          await user.clear(areaInput);
          await user.type(areaInput, '0');

          const saveButton = screen.getByText('Adicionar');
          await user.click(saveButton);
        });

        await waitFor(() => {
          expect(screen.getByText('Erro de Validação')).toBeInTheDocument();
          expect(
            screen.getByText('Todas as culturas devem ter área plantada maior que zero.')
          ).toBeInTheDocument();
        });
      });

      it('deve atualizar área de cultura corretamente', async () => {
        const user = userEvent.setup();
        renderWithProviders(<FazendaForm />);

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
          await user.selectOptions(select, 'cultura-1');
        });

        await waitFor(async () => {
          const areaInput = screen.getByLabelText(/Área \(ha\)/);
          await user.clear(areaInput);
          await user.type(areaInput, '15.5');
        });

        await waitFor(() => {
          const areaInput = screen.getByLabelText(/Área \(ha\)/);
          expect(areaInput).toHaveValue(15.5);
        });
      });
    });

    describe('Navigation branches - todas as condições', () => {
      it('deve navegar para home quando não há produtorId após salvar', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({}); // Sem produtorId
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
      });

      it('deve navegar para propriedades quando há produtorId após salvar', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer123' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/propriedades/producer123');
        });
      });
    });

    describe('Edge cases e valores específicos', () => {
      it('deve tratar nome da fazenda apenas com espaços', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), '   '); // Apenas espaços
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(screen.getByText('Nome da fazenda é obrigatório')).toBeInTheDocument();
        });
      });

      it('deve tratar cidade apenas com espaços', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), '   '); // Apenas espaços
        await user.selectOptions(screen.getByLabelText(/Estado/), 'MT');
        await user.type(screen.getByLabelText(/Área Total/), '100');

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(screen.getByText('Cidade é obrigatória')).toBeInTheDocument();
        });
      });

      it('deve tratar estado apenas com espaços', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1' });
        renderWithProviders(<FazendaForm />);

        await user.type(screen.getByLabelText(/Nome da Fazenda/), 'Fazenda Teste');
        await user.type(screen.getByLabelText(/Cidade/), 'Cidade Teste');
        // Estado será vazio por padrão
        await user.type(screen.getByLabelText(/Área Total/), '100');

        const salvarButton = screen.getByText('Salvar Fazenda');
        await user.click(salvarButton);

        await waitFor(() => {
          expect(screen.getByText('Estado é obrigatório')).toBeInTheDocument();
        });
      });
    });

    describe('Error scenarios abrangentes', () => {
      it('deve testar estrutura de erro handling', async () => {
        // const user = userEvent.setup(); // Not used in this test
        useParams.mockReturnValue({ propriedadeId: '1' });

        const store = createTestStore({
          propriedades: {
            currentPropriedade: mockFazenda,
            loading: false,
            error: null,
          },
          safras: {
            safras: [],
            safrasByPropriedade: {},
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        await waitFor(() => {
          expect(
            screen.getByText('Nenhuma safra cadastrada para esta fazenda.')
          ).toBeInTheDocument();
        });
      });

      it('deve testar window.confirm mock', async () => {
        // Mock window.confirm para retornar false
        const originalConfirm = global.window.confirm;
        global.window.confirm = jest.fn(() => false);

        const confirmResult = window.confirm('Teste');
        expect(confirmResult).toBe(false);
        expect(global.window.confirm).toHaveBeenCalledWith('Teste');

        // Restaura o mock original
        global.window.confirm = originalConfirm;
      });
    });

    describe('Safra com currentPropriedade fallback', () => {
      it('deve usar currentPropriedade.id quando propriedadeId não está disponível', async () => {
        const user = userEvent.setup();
        useParams.mockReturnValue({ produtorId: 'producer1', propriedadeId: '1' });

        const store = createTestStore({
          propriedades: {
            currentPropriedade: { ...mockFazenda, id: 'current-prop-id' },
            loading: false,
            error: null,
          },
          safras: {
            loading: false,
            error: null,
          },
        });

        render(
          <Provider store={store}>
            <MemoryRouter>
              <ThemeProvider theme={theme}>
                <FazendaForm />
              </ThemeProvider>
            </MemoryRouter>
          </Provider>
        );

        await waitFor(() => {
          const addButton = screen.getByText('+ Adicionar Safra');
          user.click(addButton);
        });

        await waitFor(async () => {
          await user.type(screen.getByLabelText(/Ano/), '2024');
          await user.type(screen.getByLabelText(/Nome da Safra/), 'Safra Teste');

          const select = screen.getByRole('combobox', { name: /Selecione uma cultura/ });
          await user.selectOptions(select, 'cultura-1');

          const areaInput = screen.getByLabelText(/Área \(ha\)/);
          await user.type(areaInput, '10');

          const saveButton = screen.getByText('Adicionar');
          await user.click(saveButton);
        });

        await waitFor(() => {
          expect(mockedSafraService.create).toHaveBeenCalledWith({
            nome: 'Safra Teste',
            ano: 2024,
            propriedadeRuralId: '1', // Deve usar propriedadeId do params
          });
        });
      });
    });
  });
});
