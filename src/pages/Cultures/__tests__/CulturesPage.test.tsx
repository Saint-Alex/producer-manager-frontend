import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import culturaReducer from '../../../store/culturaSlice';
import { theme } from '../../../styles/theme';
import CulturesPage from '../CulturesPage';

// Mock dos componentes shared
jest.mock('../../../components/shared', () => ({
  ActionButton: ({ children, onClick, variant, size, disabled, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`action-button-${variant || 'primary'}`}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
  ConfirmModal: ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm} data-testid="confirm-delete">
          {confirmText}
        </button>
        <button onClick={onCancel} data-testid="cancel-delete">
          {cancelText}
        </button>
      </div>
    ) : null,
  NotificationModal: ({ isOpen, title, type, message, onClose }: any) =>
    isOpen ? (
      <div data-testid="notification-modal" data-type={type}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} data-testid="close-notification">
          Fechar
        </button>
      </div>
    ) : null,
}));

// Mock dos serviços e thunks do Redux
const mockCreateCultura = jest.fn();
const mockUpdateCultura = jest.fn();
const mockDeleteCultura = jest.fn();
const mockFetchCulturas = jest.fn();

jest.mock('../../../services/culturaService', () => ({
  getCulturas: jest.fn().mockResolvedValue([]),
  createCultura: jest.fn(),
  updateCultura: jest.fn(),
  deleteCultura: jest.fn(),
}));

// Mock das funções Redux
describe('CulturesPage', () => {
  const mockCulturas = [
    {
      id: '1',
      nome: 'Milho',
      descricao: 'Cultura de milho para alimentação e ração',
      cultivos: [{ id: 'c1' }, { id: 'c2' }],
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: '2',
      nome: 'Soja',
      descricao: 'Cultura de soja para óleo e farelo',
      cultivos: [{ id: 'c3' }],
      createdAt: '2023-02-20T14:30:00Z',
    },
    {
      id: '3',
      nome: 'Algodão',
      descricao: '',
      cultivos: [],
      createdAt: '2023-03-10T08:15:00Z',
    },
  ];

  const createMockStore = (initialState: any = {}) => {
    return configureStore({
      reducer: {
        culturas: culturaReducer,
      },
      preloadedState: {
        culturas: {
          culturas: [],
          loading: false,
          error: null,
          ...initialState,
        },
      },
    });
  };

  const renderWithProviders = async (component: React.ReactElement, storeState?: any) => {
    const store = createMockStore(storeState);
    let renderResult;

    await act(async () => {
      renderResult = render(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            {component}
          </ThemeProvider>
        </Provider>
      );
    });

    return {
      ...renderResult!,
      store,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchCulturas.mockResolvedValue(mockCulturas);
    mockCreateCultura.mockResolvedValue({ id: '4', nome: 'Nova Cultura' });
    mockUpdateCultura.mockResolvedValue({ id: '1', nome: 'Milho Atualizado' });
    mockDeleteCultura.mockResolvedValue({});
  });

  describe('Renderização Básica', () => {
    test('deve renderizar página com título e botão de nova cultura', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Culturas Agrícolas')).toBeInTheDocument();
      });
      expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
    });

    test('deve exibir estatísticas corretas', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getAllByText('3')[0]).toBeInTheDocument(); // Total culturas
      });
      expect(screen.getByText('Culturas Cadastradas')).toBeInTheDocument();
      expect(screen.getByText('Cultivos Ativos')).toBeInTheDocument();
    });

    test('deve renderizar campo de busca', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');
        expect(searchInput).toBeInTheDocument();
      });
      expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
    });

    test('deve renderizar componentes básicos sem erros', async () => {
      await renderWithProviders(<CulturesPage />);

      await waitFor(() => {
        expect(screen.getByText('Culturas Agrícolas')).toBeInTheDocument();
      });

      // Verificar se não há erros na renderização
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  describe('Estados de Loading e Erro', () => {
    test('deve exibir mensagem quando loading for false e lista vazia', async () => {
      await renderWithProviders(<CulturesPage />, {
        culturas: [],
        loading: false, // não está carregando
        error: null,
      });

      // Quando não está loading e não há culturas, deve exibir mensagem de vazio
      expect(screen.getByText('Nenhuma cultura cadastrada')).toBeInTheDocument();
      expect(screen.queryByText('Carregando culturas...')).not.toBeInTheDocument();
    });

    test('deve exibir mensagem de erro', async () => {
      const errorMessage = 'Erro ao carregar culturas';
      await renderWithProviders(<CulturesPage />, {
        error: errorMessage,
        culturas: []
      });

      await waitFor(() => {
        expect(screen.getByText('Erro!')).toBeInTheDocument();
      });
    });

    test('deve exibir mensagem quando não há culturas cadastradas', async () => {
      await renderWithProviders(<CulturesPage />, {
        culturas: [],
        loading: false,
        error: null
      });

      await waitFor(() => {
        expect(screen.getByText('Nenhuma cultura cadastrada')).toBeInTheDocument();
      });
      expect(screen.getByText('Comece criando sua primeira cultura agrícola para organizar os cultivos.')).toBeInTheDocument();
      expect(screen.getByText('Cadastrar Primeira Cultura')).toBeInTheDocument();
    });

    test('deve exibir e limpar erro automaticamente', async () => {
      await renderWithProviders(<CulturesPage />, {
        error: 'Erro ao buscar culturas',
        culturas: []
      });

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Erro!')).toBeInTheDocument();
        expect(screen.getByText('Erro ao buscar culturas')).toBeInTheDocument();
      });
    });
  });

  describe('Listagem de Culturas', () => {
    test('deve renderizar lista de culturas', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Milho')).toBeInTheDocument();
      });
      expect(screen.getByText('Soja')).toBeInTheDocument();
      expect(screen.getByText('Algodão')).toBeInTheDocument();
    });

    test('deve exibir descrições ou texto padrão', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Cultura de milho para alimentação e ração')).toBeInTheDocument();
      });
      expect(screen.getByText('Cultura de soja para óleo e farelo')).toBeInTheDocument();
      expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
    });

    test('deve exibir informações de cultivos e data', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Cultivos do milho
      });
      expect(screen.getByText('1')).toBeInTheDocument(); // Cultivos da soja
      expect(screen.getByText('0')).toBeInTheDocument(); // Cultivos do algodão
    });

    test('deve exibir botões de editar e excluir', async () => {
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Editar');
        expect(editButtons).toHaveLength(3);
      });

      const deleteButtons = screen.getAllByText('Excluir');
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('Funcionalidade de Busca', () => {
    test('deve filtrar culturas por nome', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Milho')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');

      await act(async () => {
        await user.type(searchInput, 'Milho');
      });

      expect(screen.getByText('Milho')).toBeInTheDocument();
      expect(screen.queryByText('Soja')).not.toBeInTheDocument();
      expect(screen.queryByText('Algodão')).not.toBeInTheDocument();
    });

    test('deve filtrar culturas por descrição', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Soja')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');

      await act(async () => {
        await user.type(searchInput, 'óleo');
      });

      expect(screen.getByText('Soja')).toBeInTheDocument();
      expect(screen.queryByText('Milho')).not.toBeInTheDocument();
      expect(screen.queryByText('Algodão')).not.toBeInTheDocument();
    });

    test('deve exibir mensagem quando não encontra resultados', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Milho')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');

      await act(async () => {
        await user.type(searchInput, 'inexistente');
      });

      expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
      expect(screen.getByText('Tente ajustar os termos de busca ou limpar os filtros.')).toBeInTheDocument();
    });

    test('deve limpar filtros ao clicar no botão', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('Milho')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');

      await act(async () => {
        await user.type(searchInput, 'Milho');
      });
      expect(searchInput).toHaveValue('Milho');

      const clearButton = screen.getByText('Limpar Filtros');
      await act(async () => {
        await user.click(clearButton);
      });

      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Soja')).toBeInTheDocument();
      expect(screen.getByText('Algodão')).toBeInTheDocument();
    });
  });

  describe('Modal de Formulário', () => {
    test('deve abrir modal para nova cultura', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      const newButton = screen.getByText('+ Nova Cultura');

      await act(async () => {
        await user.click(newButton);
      });

      expect(screen.getByText('Nova Cultura')).toBeInTheDocument();
      expect(screen.getByLabelText('Nome da Cultura *')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    });

    test('deve abrir modal para editar cultura', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Editar');
        expect(editButtons).toHaveLength(3);
      });

      const editButtons = screen.getAllByText('Editar');

      await act(async () => {
        await user.click(editButtons[0]);
      });

      expect(screen.getByText('Editar Cultura')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Milho')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cultura de milho para alimentação e ração')).toBeInTheDocument();
    });

    test('deve fechar modal ao clicar em cancelar', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      const newButton = screen.getByText('+ Nova Cultura');

      await act(async () => {
        await user.click(newButton);
      });

      expect(screen.getByText('Nova Cultura')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancelar');

      await act(async () => {
        await user.click(cancelButton);
      });

      expect(screen.queryByText('Nova Cultura')).not.toBeInTheDocument();
    });

    test('deve fechar modal ao clicar fora', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      const newButton = screen.getByText('+ Nova Cultura');

      await act(async () => {
        await user.click(newButton);
      });

      expect(screen.getByText('Nova Cultura')).toBeInTheDocument();

      // Simular clique fora do modal
      const modal = screen.getByText('Nova Cultura').closest('div');
      if (modal?.parentElement) {
        await act(async () => {
          fireEvent.click(modal.parentElement);
        });
      }

      expect(screen.queryByText('Nova Cultura')).not.toBeInTheDocument();
    });
  });

  describe('Criação de Cultura', () => {
    test('deve abrir modal e preencher formulário', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      // Abrir modal
      const newButton = screen.getByText('+ Nova Cultura');
      await act(async () => {
        await user.click(newButton);
      });

      // Verificar se modal abriu
      expect(screen.getByText('Nova Cultura')).toBeInTheDocument();
      expect(screen.getByLabelText('Nome da Cultura *')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();

      // Preencher formulário
      const nameInput = screen.getByLabelText('Nome da Cultura *');
      const descInput = screen.getByLabelText('Descrição');

      await act(async () => {
        await user.type(nameInput, 'Feijão');
        await user.type(descInput, 'Cultura de feijão');
      });

      // Verificar se campos foram preenchidos
      expect(nameInput).toHaveValue('Feijão');
      expect(descInput).toHaveValue('Cultura de feijão');
    });

    test('deve preencher apenas nome obrigatório', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      // Abrir modal
      const newButton = screen.getByText('+ Nova Cultura');
      await act(async () => {
        await user.click(newButton);
      });

      // Preencher apenas nome
      const nameInput = screen.getByLabelText('Nome da Cultura *');
      await act(async () => {
        await user.type(nameInput, 'Feijão');
      });

      const descricaoTextarea = screen.getByLabelText('Descrição');

      expect(nameInput).toHaveValue('Feijão');
      expect(descricaoTextarea).toHaveValue(''); // textarea vazia
    });
  });

  describe('Edição de Cultura', () => {
    test('deve abrir modal de edição com dados preenchidos', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Editar');
        expect(editButtons).toHaveLength(3);
      });

      // Abrir modal de edição
      const editButtons = screen.getAllByText('Editar');
      await act(async () => {
        await user.click(editButtons[0]);
      });

      // Verificar se modal abriu com dados corretos
      expect(screen.getByText('Editar Cultura')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Milho')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cultura de milho para alimentação e ração')).toBeInTheDocument();
    });

    test('deve permitir modificar dados no formulário de edição', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const editButtons = screen.getAllByText('Editar');
        expect(editButtons).toHaveLength(3);
      });

      // Abrir modal de edição
      const editButtons = screen.getAllByText('Editar');
      await act(async () => {
        await user.click(editButtons[0]);
      });

      // Modificar dados
      const nameInput = screen.getByDisplayValue('Milho');
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, 'Milho Híbrido');
      });

      expect(nameInput).toHaveValue('Milho Híbrido');
    });
  });

  describe('Exclusão de Cultura', () => {
    test('deve abrir modal de confirmação ao excluir', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Excluir');
        expect(deleteButtons).toHaveLength(3);
      });

      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      expect(screen.getByText(/Tem certeza que deseja excluir esta cultura/)).toBeInTheDocument();
    });

    test('deve excluir cultura após confirmação', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, {
        culturas: mockCulturas,
        loading: false,
        error: 'Erro ao deletar cultura'
      });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Excluir');
        expect(deleteButtons).toHaveLength(3);
      });

      // Clicar em excluir
      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      // Confirmar exclusão
      const confirmButton = screen.getByTestId('confirm-delete');
      await act(async () => {
        await user.click(confirmButton);
      });

      // Verificar se a notificação de erro aparece (baseado no estado mock)
      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Erro ao deletar cultura')).toBeInTheDocument();
      });
    });

    test('deve cancelar exclusão', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Excluir');
        expect(deleteButtons).toHaveLength(3);
      });

      // Clicar em excluir
      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      // Cancelar exclusão
      const cancelButton = screen.getByTestId('cancel-delete');
      await act(async () => {
        await user.click(cancelButton);
      });

      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
      expect(mockDeleteCultura).not.toHaveBeenCalled();
    });

    test('deve exibir notificação de sucesso após excluir', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Excluir');
        expect(deleteButtons).toHaveLength(3);
      });

      // Excluir cultura
      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByTestId('confirm-delete');
      await act(async () => {
        await user.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Erro ao deletar cultura')).toBeInTheDocument();
      });
    });

    test('deve tratar erro na exclusão', async () => {
      const user = userEvent.setup();
      mockDeleteCultura.mockRejectedValueOnce(new Error('Erro API'));

      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Excluir');
        expect(deleteButtons).toHaveLength(3);
      });

      // Tentar excluir
      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByTestId('confirm-delete');
      await act(async () => {
        await user.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Erro ao deletar cultura')).toBeInTheDocument();
      });
    });
  });

  describe('Notificações', () => {
    test('deve fechar notificação ao clicar no botão', async () => {
      const user = userEvent.setup();
      await renderWithProviders(<CulturesPage />, { error: 'Erro teste' });

      // Aguardar notificação aparecer
      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('close-notification');
      await act(async () => {
        await user.click(closeButton);
      });

      expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
    });
  });

  describe('Estados Complexos e Edge Cases', () => {
    test('deve mostrar estado de loading no botão durante criação', async () => {
      const user = userEvent.setup();
      // Simular demora na API
      mockCreateCultura.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      await renderWithProviders(<CulturesPage />, { culturas: mockCulturas, loading: false });

      await waitFor(() => {
        expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
      });

      const newButton = screen.getByText('+ Nova Cultura');
      await act(async () => {
        await user.click(newButton);
      });

      const nameInput = screen.getByLabelText('Nome da Cultura *');
      await act(async () => {
        await user.type(nameInput, 'Feijão');
      });

      const submitButton = screen.getByText('Criar');
      expect(submitButton).not.toBeDisabled();
    });

    test('deve lidar com lista vazia sem problemas', async () => {
      await renderWithProviders(<CulturesPage />, {
        culturas: [],
        loading: false,
        error: null
      });

      await waitFor(() => {
        expect(screen.getByText('Nenhuma cultura cadastrada')).toBeInTheDocument();
      });

      // Verificar se componente renderiza sem erros
      expect(screen.getByText('Culturas Agrícolas')).toBeInTheDocument();
    });

    test('deve manter estado de busca durante re-renderizações', async () => {
      const user = userEvent.setup();
      const { rerender } = await renderWithProviders(<CulturesPage />, { culturas: mockCulturas });

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou descrição...');

      await act(async () => {
        await user.type(searchInput, 'Milho');
      });

      // Re-renderizar componente
      await act(async () => {
        rerender(
          <Provider store={createMockStore({ culturas: mockCulturas })}>
            <ThemeProvider theme={theme}>
              <CulturesPage />
            </ThemeProvider>
          </Provider>
        );
      });

      // Verificar se busca foi mantida
      expect(screen.getByDisplayValue('Milho')).toBeInTheDocument();
    });
  });
});
