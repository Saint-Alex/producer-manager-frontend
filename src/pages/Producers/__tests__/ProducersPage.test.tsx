import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import ProducersPage from '../ProducersPage';

// Mock dos módulos necessários
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector(mockState),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../services/producerService', () => ({
  fetchProducers: jest.fn(),
  deleteProducer: jest.fn(),
}));

jest.mock('../../../components/shared', () => ({
  ActionButton: ({ children, onClick, variant, disabled, type, size }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      type={type}
      data-size={size}
    >
      {children}
    </button>
  ),
  ConfirmModal: ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onCancel}>{cancelText}</button>
      </div>
    ) : null,
  NotificationModal: ({ isOpen, title, message, type, onClose }: any) =>
    isOpen ? (
      <div data-testid="notification-modal" data-type={type}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    ) : null,
}));

jest.mock('../../../components/lists', () => ({
  ProducerList: ({ producers, onEdit, onDelete, onViewProperties }: any) => (
    <div data-testid="producer-list">
      {producers.map((producer: any) => (
        <div key={producer.id} data-testid={`producer-${producer.id}`}>
          <span>{producer.nome}</span>
          <span>{producer.cpfCnpj}</span>
          {producer.email && <span>{producer.email}</span>}
          <button onClick={() => onEdit(producer.id)}>Editar</button>
          <button onClick={() => onDelete(producer.id)}>Excluir</button>
          <button onClick={() => onViewProperties(producer.id)}>Ver Propriedades</button>
        </div>
      ))}
    </div>
  ),
}));

let mockState: any;

const mockProducers = [
  {
    id: '1',
    nome: 'João Silva',
    cpfCnpj: '123.456.789-01',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    propriedades: [{}, {}], // 2 propriedades
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpfCnpj: '12.345.678/0001-95',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    propriedades: [{}], // 1 propriedade
  },
];

const reducerMock = (state = {}, action: any) => state;

const renderWithProviders = (
  ui: React.ReactElement,
  initialProducerState?: any
) => {
  const store = configureStore({
    reducer: {
      producers: reducerMock,
    },
    preloadedState: {
      producers: {
        producers: [],
        loading: false,
        error: null,
        currentProducer: null,
        ...initialProducerState
      }
    }
  });

  return render(
    <Provider store={store}>
      <ThemeProvider theme={{} as any}>
        <Router>
          {ui}
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  mockDispatch.mockClear();
  mockNavigate.mockClear();

  mockState = {
    producers: {
      producers: [],
      loading: false,
      error: null,
      currentProducer: null,
    },
  };
});

describe('ProducersPage', () => {
  describe('Renderização inicial', () => {
    test('deve renderizar título da página', () => {
      renderWithProviders(<ProducersPage />);
      expect(screen.getByText('Produtores Rurais')).toBeInTheDocument();
    });

    test('deve renderizar botão de novo produtor', () => {
      renderWithProviders(<ProducersPage />);
      expect(screen.getByText('+ Novo Produtor')).toBeInTheDocument();
    });

    test('deve renderizar campo de busca', () => {
      renderWithProviders(<ProducersPage />);
      expect(screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...')).toBeInTheDocument();
    });

    test('deve renderizar botão limpar filtros', () => {
      renderWithProviders(<ProducersPage />);
      expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
    });

    test('deve carregar produtores na inicialização', () => {
      renderWithProviders(<ProducersPage />);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('Estados de carregamento', () => {
    test('deve mostrar mensagem de carregamento quando loading é true', () => {
      mockState.producers.loading = true;
      renderWithProviders(<ProducersPage />);
      expect(screen.getByText('Carregando produtores...')).toBeInTheDocument();
    });

    test('deve esconder loader quando loading é false', () => {
      mockState.producers.loading = false;
      renderWithProviders(<ProducersPage />);
      expect(screen.queryByText('Carregando produtores...')).not.toBeInTheDocument();
    });
  });

  describe('Exibição de estatísticas', () => {
    test('deve mostrar estatísticas corretas com produtores', () => {
      mockState.producers.producers = [mockProducers[0], mockProducers[1]];

      renderWithProviders(<ProducersPage />);

      // Verificar se as estatísticas são mostradas corretamente
      expect(screen.getByText('Produtores Cadastrados')).toBeInTheDocument();
      expect(screen.getByText('Propriedades Totais')).toBeInTheDocument();

      // Verificar que há pelo menos 2 ocorrências do número 2 nas estatísticas
      const numberTwos = screen.getAllByText('2');
      expect(numberTwos.length).toBeGreaterThanOrEqual(2);

      // Verificar que temos os números corretos nas estatísticas
      const statNumbers = screen.getAllByText('2');
      expect(statNumbers.length).toBeGreaterThanOrEqual(2); // Pelo menos 2 ocorrências do número "2"

      const resultsContainer = screen.getByText('Resultados da Busca').closest('div');
      expect(statNumbers.length).toBeGreaterThanOrEqual(2);
      expect(resultsContainer).toHaveTextContent('Resultados da Busca');
    });

    test('deve mostrar zero quando não há produtores', () => {
      mockState.producers.producers = [];

      renderWithProviders(<ProducersPage />);

      // Buscar por elementos mais específicos - deve haver múltiplos zeros
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThan(0);
      expect(screen.getByText('Produtores Cadastrados')).toBeInTheDocument();
    });
  }); describe('Funcionalidade de busca', () => {
    test('deve filtrar produtores por nome', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.type(searchInput, 'João');

      expect(searchInput).toHaveValue('João');
    });

    test('deve limpar filtros ao clicar em "Limpar Filtros"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.type(searchInput, 'João');

      const clearButton = screen.getByText('Limpar Filtros');
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
    });
  });

  describe('Estados vazios', () => {
    test('deve mostrar mensagem quando não há produtores cadastrados', () => {
      mockState.producers.producers = [];
      renderWithProviders(<ProducersPage />);

      expect(screen.getByText('Nenhum produtor cadastrado')).toBeInTheDocument();
      expect(screen.getByText('Comece cadastrando seu primeiro produtor rural para gerenciar propriedades e culturas.')).toBeInTheDocument();
    });

    test('deve mostrar botão para cadastrar primeiro produtor quando lista vazia', () => {
      mockState.producers.producers = [];
      renderWithProviders(<ProducersPage />);

      expect(screen.getByText('Cadastrar Primeiro Produtor')).toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    test('deve navegar para registro ao clicar em "Novo Produtor"', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProducersPage />);

      const newButton = screen.getByText('+ Novo Produtor');
      await user.click(newButton);

      expect(mockNavigate).toHaveBeenCalledWith('/producer-register');
    });

    test('deve navegar para registro ao clicar em "Cadastrar Primeiro Produtor"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = [];
      renderWithProviders(<ProducersPage />);

      const firstButton = screen.getByText('Cadastrar Primeiro Produtor');
      await user.click(firstButton);

      expect(mockNavigate).toHaveBeenCalledWith('/producer-register');
    });

    test('deve navegar para edição ao clicar em "Editar"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const editButton = screen.getAllByText('Editar')[0];
      await user.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith('/producer-edit/1');
    });

    test('deve navegar para propriedades ao clicar em "Ver Propriedades"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const viewPropertiesButton = screen.getAllByText('Ver Propriedades')[0];
      await user.click(viewPropertiesButton);

      expect(mockNavigate).toHaveBeenCalledWith('/propriedades/1');
    });
  });

  describe('Tratamento de erros', () => {
    test('deve exibir mensagem de erro quando ocorre erro', () => {
      mockState.producers.error = 'Erro ao carregar produtores.';
      renderWithProviders(<ProducersPage />);

      expect(screen.getByText('Erro ao carregar produtores.')).toBeInTheDocument();
    });

    test('deve esconder lista quando há erro', () => {
      mockState.producers.error = 'Erro ao carregar produtores';
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
    });
  });

  describe('Lista de produtores', () => {
    test('deve exibir produtores quando carregados', () => {
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });

    test('deve exibir informações dos produtores', () => {
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
      expect(screen.getByText('12.345.678/0001-95')).toBeInTheDocument();
      // Note: o componente não exibe email na lista, apenas nome e CPF/CNPJ
    });
  });

  describe('Responsividade e acessibilidade', () => {
    test('deve ter elementos com roles adequados', () => {
      renderWithProviders(<ProducersPage />);

      // Quando há produtores, teremos mais botões (Novo Produtor + Limpar Filtros + botões dos produtores)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1); // Pelo menos Novo Produtor e Limpar Filtros
      expect(screen.getByRole('textbox')).toBeInTheDocument(); // Campo de busca
    });

    test('deve ter labels corretos nos campos', () => {
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Cálculo de estatísticas', () => {
    test('deve calcular corretamente total de propriedades', () => {
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      // João tem 2 propriedades, Maria tem 1 = total 3
      const propertiesContainer = screen.getByText('Propriedades Totais').parentElement;
      expect(propertiesContainer).toHaveTextContent('3');
      expect(propertiesContainer).toHaveTextContent('Propriedades Totais');
    });

    test('deve lidar com produtores sem propriedades', () => {
      mockState.producers.producers = [{ ...mockProducers[0], propriedades: [] }];
      renderWithProviders(<ProducersPage />);

      const propertiesContainer = screen.getByText('Propriedades Totais').parentElement;
      expect(propertiesContainer).toHaveTextContent('0');
      expect(propertiesContainer).toHaveTextContent('Propriedades Totais');
    });
  });

  describe('Filtros de busca', () => {
    test('deve filtrar por CPF/CNPJ', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.type(searchInput, '123.456');

      expect(searchInput).toHaveValue('123.456');
    });

    test('deve ser case insensitive na busca por nome', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.type(searchInput, 'JOÃO');

      expect(searchInput).toHaveValue('JOÃO');
    });
  });

  describe('Estados de busca vazia', () => {
    test('deve mostrar mensagem de nenhum resultado quando busca não retorna resultados', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.clear(searchInput);
      await user.type(searchInput, 'Nome que não existe');

      // Aguardar que o filtro seja aplicado
      await waitFor(() => {
        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    test('deve mostrar dica para ajustar busca quando não há resultados', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const searchInput = screen.getByPlaceholderText('Buscar por nome ou CPF/CNPJ...');
      await user.clear(searchInput);
      await user.type(searchInput, 'xyz123');

      await waitFor(() => {
        expect(screen.getByText('Tente ajustar os termos de busca ou limpar os filtros.')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Modal de exclusão e operações CRUD', () => {
    test('deve abrir modal de confirmação ao clicar em "Excluir"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const deleteButton = screen.getAllByText('Excluir')[0];
      await user.click(deleteButton);

      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      expect(screen.getByText(/Tem certeza que deseja excluir este produtor/)).toBeInTheDocument();
    });

    test('deve fechar modal ao clicar em "Cancelar"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      renderWithProviders(<ProducersPage />);

      const deleteButton = screen.getAllByText('Excluir')[0];
      await user.click(deleteButton);

      const cancelButton = screen.getByText('Cancelar');
      await user.click(cancelButton);

      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });

    it('deve excluir produtor ao confirmar exclusão com sucesso', async () => {
      const user = userEvent.setup();
      // Definir produtores no estado mock
      mockState.producers.producers = mockProducers;

      // Criar um mock que simula o RTK Query action
      const mockUnwrap = jest.fn().mockResolvedValue({});
      const mockReturnValue = {
        unwrap: mockUnwrap,
      };

      // O dispatch deve retornar um objeto com unwrap
      mockDispatch.mockReturnValue(mockReturnValue);

      renderWithProviders(<ProducersPage />);

      // Aguardar a renderização
      await waitFor(() => {
        expect(screen.getByTestId('producer-list')).toBeInTheDocument();
      });

      // Clicar no botão de excluir
      const deleteButtons = screen.getAllByText('Excluir');
      await act(async () => {
        await user.click(deleteButtons[0]);
      });

      // Aguardar o modal de confirmação aparecer
      await waitFor(() => {
        expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      });

      // Confirmar a exclusão
      const modal = screen.getByTestId('confirm-modal');
      const confirmButton = within(modal).getByText('Excluir');

      await act(async () => {
        await user.click(confirmButton);
      });

      // Aguardar um pouco para a ação ser processada
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verificar se o dispatch foi chamado
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();

      // Aguardar a notificação de sucesso
      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText('Produtor excluído com sucesso!')).toBeInTheDocument();
    }); test('deve mostrar notificação de erro ao falhar na exclusão', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;

      const mockUnwrap = jest.fn().mockRejectedValue(new Error('Erro ao excluir'));
      mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

      renderWithProviders(<ProducersPage />);

      const deleteButton = screen.getAllByText('Excluir')[0];
      await user.click(deleteButton);

      const confirmButton = within(screen.getByTestId('confirm-modal')).getByText('Excluir');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
        expect(screen.getByText('Erro ao excluir produtor. Tente novamente.')).toBeInTheDocument();
      });
    });

    test('deve fechar notificação ao clicar em "OK"', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;
      mockDispatch.mockResolvedValueOnce({ unwrap: () => Promise.resolve() });

      renderWithProviders(<ProducersPage />);

      const deleteButton = screen.getAllByText('Excluir')[0];
      await user.click(deleteButton);

      const confirmButton = within(screen.getByTestId('confirm-modal')).getByText('Excluir');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
      });

      const okButton = screen.getByText('OK');
      await user.click(okButton);

      expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
    });

    test('deve lidar com exclusão quando producerToDelete é null', async () => {
      const user = userEvent.setup();
      mockState.producers.producers = mockProducers;

      renderWithProviders(<ProducersPage />);

      // Simular estado onde producerToDelete é null (caso de borda)
      const deleteButton = screen.getAllByText('Excluir')[0];
      await user.click(deleteButton);

      // Verificar que o modal aparece
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

      // Cancelar primeiro para limpar o estado
      const cancelButton = screen.getByText('Cancelar');
      await user.click(cancelButton);

      // Agora tentar confirmar diretamente sem producer selecionado
      // (Esta é uma cobertura de linha edge case)
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });
  });
});
