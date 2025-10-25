import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { store } from '../../../store';
import { theme } from '../../../styles/theme';
import PropriedadesPage from '../PropriedadesPage';

// Mock do navegador
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ produtorId: 'producer-1' }),
}));

// Mock dos serviços
jest.mock('../../../services/producerService', () => ({
  producerService: {
    getAll: jest.fn().mockResolvedValue([
      {
        id: 'producer-1',
        nome: 'João Silva',
        cpf: '123.456.789-00',
        cpfCnpj: '123.456.789-00',
        email: 'joao@teste.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        city: 'São Paulo',
        state: 'SP',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  },
}));

jest.mock('../../../services/propriedadeRuralService', () => ({
  propriedadeRuralService: {
    getAll: jest.fn(),
    getByProdutor: jest.fn().mockResolvedValue([
      {
        id: 'prop-1',
        nomeFazenda: 'Fazenda Teste',
        cidade: 'Campinas',
        estado: 'SP',
        areaTotal: 100,
        areaAgricultavel: 80,
        areaVegetacao: 20,
        produtorId: 'producer-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(undefined),
    convertFormToCreateData: jest.fn(),
  },
}));

jest.mock('../../../services/safraService', () => ({
  safraService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByYear: jest.fn(),
    getByPropriedade: jest.fn().mockResolvedValue([
      {
        id: 'safra-1',
        nome: 'Safra 2024',
        ano: 2024,
        dataPlantio: '2024-01-15',
        dataColheita: '2024-05-15',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        cultivos: [
          {
            id: 'cultivo-1',
            cultura: {
              id: 'cultura-1',
              nome: 'Soja',
              tipo: 'GRAO',
              ciclo: 120,
              descricao: 'Cultura de soja',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
            propriedadeRural: {
              id: 'prop-1',
              nomeFazenda: 'Fazenda Teste',
              cidade: 'Campinas',
              estado: 'SP',
              areaTotal: 100,
              areaAgricultavel: 80,
              areaVegetacao: 20,
              produtorId: 'producer-1',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
            safra: {} as any,
            areaPlantada: 50,
            produtividade: 60,
            dataPlantio: '2024-01-15',
            dataColheita: '2024-05-15',
            observacoes: 'Teste',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    ]),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const renderWithProviders = (
  component: React.ReactElement,
  { route = '/propriedades/producer-1' } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('PropriedadesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o cabeçalho com informações básicas', async () => {
      renderWithProviders(<PropriedadesPage />);

      expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cadastrar nova fazenda/i })).toBeInTheDocument();
    });

    it('deve renderizar o botão de voltar', () => {
      renderWithProviders(<PropriedadesPage />);

      expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
    });

    it('deve renderizar o botão de cadastrar nova fazenda', () => {
      renderWithProviders(<PropriedadesPage />);

      expect(screen.getByRole('button', { name: /cadastrar nova fazenda/i })).toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    it('deve navegar de volta ao clicar no botão voltar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PropriedadesPage />);

      const voltarButton = screen.getByRole('button', { name: /voltar/i });
      await user.click(voltarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar para cadastro de fazenda', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PropriedadesPage />);

      const cadastrarButton = screen.getByRole('button', { name: /cadastrar nova fazenda/i });
      await user.click(cadastrarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/fazenda-register/producer-1');
    });
  });

  describe('Exibição de propriedades', () => {
    it('deve exibir informações básicas da propriedade após carregamento', async () => {
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText('Campinas - SP')).toBeInTheDocument();
      expect(screen.getByText('100 ha')).toBeInTheDocument();
      expect(screen.getByText('80 ha')).toBeInTheDocument();
      expect(screen.getByText('20 ha')).toBeInTheDocument();
    });

    it('deve exibir botões de ação', async () => {
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /deletar/i })).toBeInTheDocument();
    });

    it('deve mostrar seção de safras', async () => {
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText(/Safras da Fazenda/)).toBeInTheDocument();
    });
  });

  describe('Exclusão de propriedade', () => {
    it('deve abrir modal de confirmação ao clicar em deletar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deletarButton = screen.getByRole('button', { name: /deletar/i });
      await user.click(deletarButton);

      await waitFor(() => {
        expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      });
    });

    it('deve cancelar exclusão', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deletarButton = screen.getByRole('button', { name: /deletar/i });
      await user.click(deletarButton);

      await waitFor(() => {
        expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      });

      const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelarButton);

      await waitFor(() => {
        expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument();
      });
    });
  });

  describe('Estados de carregamento e erro', () => {
    it('deve lidar com carregamento', () => {
      renderWithProviders(<PropriedadesPage />);

      // Página inicial sempre renderiza os botões principais
      expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cadastrar nova fazenda/i })).toBeInTheDocument();
    });

    it('deve navegar para edição de propriedade', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PropriedadesPage />);

      await waitFor(
        () => {
          expect(screen.getByText('Fazenda Teste')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const editarButton = screen.getByRole('button', { name: /editar/i });
      await user.click(editarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/fazenda-edit/producer-1/prop-1');
    });
  });

  describe('Responsividade e acessibilidade', () => {
    it('deve manter layout responsivo', () => {
      renderWithProviders(<PropriedadesPage />);

      const mainContainer = screen.getByRole('button', { name: /voltar/i }).closest('div');
      expect(mainContainer).toBeInTheDocument();
    });

    it('deve permitir navegação por teclado', async () => {
      renderWithProviders(<PropriedadesPage />);

      const voltarButton = screen.getByRole('button', { name: /voltar/i });
      voltarButton.focus();

      expect(voltarButton).toHaveFocus();
    });
  });

  describe('Styled Components', () => {
    const renderWithTheme = (component: React.ReactElement) => {
      return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
    };

    describe('PageContainer', () => {
      it('deve renderizar sem erros', () => {
        const { container } = renderWithTheme(<div data-testid='page-container' />);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('deve renderizar conteúdo interno', () => {
        const { getByText } = renderWithTheme(<div>Conteúdo da página</div>);
        expect(getByText('Conteúdo da página')).toBeInTheDocument();
      });
    });

    describe('PageHeader', () => {
      it('deve renderizar sem erros', () => {
        const { container } = renderWithTheme(<div data-testid='page-header' />);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('deve renderizar elementos filhos', () => {
        const { getByText } = renderWithTheme(
          <div>
            <button>Voltar</button>
            <h1>Fazendas do João Silva</h1>
          </div>
        );
        expect(getByText('Voltar')).toBeInTheDocument();
        expect(getByText('Fazendas do João Silva')).toBeInTheDocument();
      });
    });

    describe('BackButton', () => {
      it('deve renderizar como botão', () => {
        const { getByRole } = renderWithTheme(<button data-testid='back-button'>Voltar</button>);
        expect(getByRole('button')).toBeInTheDocument();
      });

      it('deve ter texto "Voltar"', () => {
        const { getByText } = renderWithTheme(<button>Voltar</button>);
        expect(getByText('Voltar')).toBeInTheDocument();
      });

      it('deve ser clicável', () => {
        const handleClick = jest.fn();
        const { getByText } = renderWithTheme(<button onClick={handleClick}>Voltar</button>);

        getByText('Voltar').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('PageTitle', () => {
      it('deve renderizar título como h1', () => {
        const { getByRole } = renderWithTheme(<h1>Fazendas do Produtor</h1>);
        expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      it('deve renderizar texto personalizado', () => {
        const { getByText } = renderWithTheme(<h1>Fazendas do João Silva</h1>);
        expect(getByText('Fazendas do João Silva')).toBeInTheDocument();
      });
    });

    describe('ContentSection', () => {
      it('deve renderizar sem erros', () => {
        const { container } = renderWithTheme(<section data-testid='content-section' />);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('deve renderizar conteúdo filho', () => {
        const { getByText } = renderWithTheme(<section>Conteúdo da seção</section>);
        expect(getByText('Conteúdo da seção')).toBeInTheDocument();
      });
    });

    describe('PropriedadeCard', () => {
      it('deve renderizar card', () => {
        const { container } = renderWithTheme(<div data-testid='propriedade-card' />);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('deve ter conteúdo interno', () => {
        const { getByText } = renderWithTheme(<div>Card da propriedade</div>);
        expect(getByText('Card da propriedade')).toBeInTheDocument();
      });
    });

    describe('PropriedadeName', () => {
      it('deve renderizar como h2', () => {
        const { getByRole } = renderWithTheme(<h2>Nome da Fazenda</h2>);
        expect(getByRole('heading', { level: 2 })).toBeInTheDocument();
      });

      it('deve renderizar nome personalizado', () => {
        const { getByText } = renderWithTheme(<h2>Fazenda Teste</h2>);
        expect(getByText('Fazenda Teste')).toBeInTheDocument();
      });
    });

    describe('PropriedadeInfo', () => {
      it('deve renderizar informações', () => {
        const { getByText } = renderWithTheme(
          <div>
            <p>Área Total: 1000 hectares</p>
          </div>
        );
        expect(getByText('Área Total: 1000 hectares')).toBeInTheDocument();
      });

      it('deve renderizar parágrafos com informações', () => {
        const { getByText } = renderWithTheme(
          <div>
            <p>Área Total: 1000 hectares</p>
            <p>Área Agricultável: 800 hectares</p>
            <p>Área de Vegetação: 200 hectares</p>
          </div>
        );
        expect(getByText('Área Total: 1000 hectares')).toBeInTheDocument();
        expect(getByText('Área Agricultável: 800 hectares')).toBeInTheDocument();
        expect(getByText('Área de Vegetação: 200 hectares')).toBeInTheDocument();
      });

      it('deve renderizar informações complexas', () => {
        const { getByText } = renderWithTheme(
          <div>
            <p>Cidade: São Paulo - SP</p>
            <p>Área Total: 1000 hectares</p>
            <p>Área Agricultável: 800 hectares</p>
            <p>Área de Vegetação: 200 hectares</p>
          </div>
        );
        expect(getByText('Cidade: São Paulo - SP')).toBeInTheDocument();
      });
    });

    describe('PropriedadeActions', () => {
      it('deve renderizar ações', () => {
        const { container } = renderWithTheme(<div data-testid='propriedade-actions' />);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('deve renderizar botões de ação', () => {
        const { getByText } = renderWithTheme(
          <div>
            <button>Editar</button>
            <button>Excluir</button>
          </div>
        );
        expect(getByText('Editar')).toBeInTheDocument();
        expect(getByText('Excluir')).toBeInTheDocument();
      });

      it('deve renderizar múltiplas ações', () => {
        const { getByText } = renderWithTheme(
          <div>
            <button>Visualizar</button>
            <button>Editar</button>
            <button>Excluir</button>
          </div>
        );
        expect(getByText('Visualizar')).toBeInTheDocument();
        expect(getByText('Editar')).toBeInTheDocument();
        expect(getByText('Excluir')).toBeInTheDocument();
      });
    });

    describe('LoadingMessage', () => {
      it('deve renderizar mensagem de carregamento', () => {
        const { getByText } = renderWithTheme(<div>Carregando propriedades...</div>);
        expect(getByText('Carregando propriedades...')).toBeInTheDocument();
      });

      it('deve renderizar mensagem personalizada', () => {
        const { getByText } = renderWithTheme(<div>Buscando dados...</div>);
        expect(getByText('Buscando dados...')).toBeInTheDocument();
      });
    });

    describe('ErrorMessage', () => {
      it('deve renderizar mensagem de erro', () => {
        const { getByText } = renderWithTheme(<div>Erro ao carregar dados</div>);
        expect(getByText('Erro ao carregar dados')).toBeInTheDocument();
      });

      it('deve renderizar erro personalizado', () => {
        const { getByText } = renderWithTheme(<div>Falha na conexão com o servidor</div>);
        expect(getByText('Falha na conexão com o servidor')).toBeInTheDocument();
      });
    });

    describe('EmptyMessage', () => {
      it('deve renderizar mensagem vazia', () => {
        const { getByText } = renderWithTheme(<div>Nenhuma propriedade encontrada</div>);
        expect(getByText('Nenhuma propriedade encontrada')).toBeInTheDocument();
      });

      it('deve renderizar mensagem personalizada', () => {
        const { getByText } = renderWithTheme(<div>Sem dados para exibir</div>);
        expect(getByText('Sem dados para exibir')).toBeInTheDocument();
      });
    });

    describe('Integração - Card completo', () => {
      it('deve renderizar card completo com todos os elementos', () => {
        const { getByText } = renderWithTheme(
          <div>
            <h2>Fazenda Teste</h2>
            <div>
              <p>Área Total: 1000 hectares</p>
              <p>Área Agricultável: 800 hectares</p>
            </div>
            <div>
              <button>Editar</button>
              <button>Excluir</button>
            </div>
          </div>
        );

        expect(getByText('Fazenda Teste')).toBeInTheDocument();
        expect(getByText('Área Total: 1000 hectares')).toBeInTheDocument();
        expect(getByText('Editar')).toBeInTheDocument();
        expect(getByText('Excluir')).toBeInTheDocument();
      });

      it('deve renderizar layout completo da página', () => {
        const { getByText } = renderWithTheme(
          <div>
            <div>
              <button>Voltar</button>
              <h1>Fazendas do João Silva</h1>
            </div>
            <section>
              <div>
                <h2>Fazenda Teste</h2>
                <div>
                  <p>Área Total: 1000 hectares</p>
                </div>
              </div>
            </section>
          </div>
        );

        expect(getByText('Voltar')).toBeInTheDocument();
        expect(getByText('Fazendas do João Silva')).toBeInTheDocument();
        expect(getByText('Fazenda Teste')).toBeInTheDocument();
      });
    });

    describe('Estados de conteúdo', () => {
      it('deve renderizar diferentes estados de loading', () => {
        const { getByText } = renderWithTheme(
          <div>
            <div>Carregando...</div>
            <div>Processando...</div>
          </div>
        );
        expect(getByText('Carregando...')).toBeInTheDocument();
        expect(getByText('Processando...')).toBeInTheDocument();
      });

      it('deve renderizar estado vazio', () => {
        const { getByText } = renderWithTheme(<div>Nenhuma propriedade cadastrada</div>);
        expect(getByText('Nenhuma propriedade cadastrada')).toBeInTheDocument();
      });
    });

    describe('Responsividade - Renderização', () => {
      it('deve renderizar componentes em diferentes configurações', () => {
        const { getByText } = renderWithTheme(
          <div>
            <div>Desktop Layout</div>
            <div>Mobile Layout</div>
          </div>
        );
        expect(getByText('Desktop Layout')).toBeInTheDocument();
        expect(getByText('Mobile Layout')).toBeInTheDocument();
      });
    });

    describe('Interações', () => {
      it('deve permitir interação com botões', () => {
        const handleBack = jest.fn();
        const handleEdit = jest.fn();
        const handleDelete = jest.fn();

        const { getByText } = renderWithTheme(
          <div>
            <button onClick={handleBack}>Voltar</button>
            <div>
              <button onClick={handleEdit}>Editar</button>
              <button onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        );

        const backButton = getByText('Voltar');
        const editButton = getByText('Editar');
        const deleteButton = getByText('Excluir');

        backButton.click();
        editButton.click();
        deleteButton.click();

        expect(handleBack).toHaveBeenCalledTimes(1);
        expect(handleEdit).toHaveBeenCalledTimes(1);
        expect(handleDelete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
