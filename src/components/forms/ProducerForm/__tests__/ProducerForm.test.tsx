import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import { ProducerFormData } from '../../../../types/producer';
import { ProducerForm } from '../ProducerForm';

// Mock para o módulo de validadores
jest.mock('../../../../utils/validators', () => ({
  formatCPF: jest.fn((value: string) => {
    if (value.length <= 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  }),
  formatCNPJ: jest.fn((value: string) => {
    if (value.length <= 14) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  }),
  validateCPF: jest.fn((cpf: string) => cpf === '12345678901'), // CPF válido para teste
  validateCNPJ: jest.fn((cnpj: string) => cnpj === '12345678000195'), // CNPJ válido para teste
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ProducerForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  describe('Renderização inicial', () => {
    it('deve renderizar o formulário com todos os campos obrigatórios', () => {
      renderWithTheme(<ProducerForm {...defaultProps} />);

      expect(
        screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i)
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Nome completo do produtor/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('deve renderizar título "Cadastrar Produtor" quando não está em modo edição', () => {
      renderWithTheme(<ProducerForm {...defaultProps} />);

      expect(screen.getByText('Cadastrar Produtor')).toBeInTheDocument();
    });

    it('deve renderizar título "Editar Produtor" quando está em modo edição', () => {
      renderWithTheme(<ProducerForm {...defaultProps} isEditMode={true} />);

      expect(screen.getByText('Editar Produtor')).toBeInTheDocument();
    });

    it('deve renderizar botão "Adicionar Fazenda"', () => {
      renderWithTheme(<ProducerForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /adicionar fazenda/i })).toBeInTheDocument();
    });
  });

  describe('Validação de formulário', () => {
    it('deve mostrar erro quando CPF/CNPJ está vazio', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CPF/CNPJ é obrigatório')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve mostrar erro quando nome está vazio', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cpfInput, '12345678901');
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Nome do produtor é obrigatório')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve mostrar erro quando nome tem menos de 2 caracteres', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      await act(async () => {
        await user.type(nomeInput, 'A');
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro para CPF inválido', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cpfInput, '11111111111'); // CPF inválido
      });

      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      await act(async () => {
        await user.type(nomeInput, 'João Silva');
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CPF inválido')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro para CNPJ inválido', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cnpjInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cnpjInput, '11111111111111'); // CNPJ inválido
      });

      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      await act(async () => {
        await user.type(nomeInput, 'Empresa LTDA');
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CNPJ inválido')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro para documento com tamanho inválido', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const docInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(docInput, '123456789'); // Tamanho inválido
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Formatação de campos', () => {
    it('deve formatar CPF durante a digitação', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cpfInput, '12345678901');
      });

      // Verifica se o formatCPF foi chamado
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { formatCPF } = require('../../../../utils/validators');
      expect(formatCPF).toHaveBeenCalled();
    });

    it('deve formatar CNPJ durante a digitação', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cnpjInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cnpjInput, '12345678000195');
      });

      // Verifica se o formatCNPJ foi chamado
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { formatCNPJ } = require('../../../../utils/validators');
      expect(formatCNPJ).toHaveBeenCalled();
    });
  });

  describe('Limpeza de erros', () => {
    it('deve limpar erro ao corrigir campo CPF/CNPJ', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Submeter formulário vazio para gerar erro
      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CPF/CNPJ é obrigatório')).toBeInTheDocument();
      });

      // Corrigir o campo
      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cpfInput, '12345678901');
      });

      await waitFor(() => {
        expect(screen.queryByText('CPF/CNPJ é obrigatório')).not.toBeInTheDocument();
      });
    });

    it('deve limpar erro ao corrigir campo Nome', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Submeter formulário vazio para gerar erro
      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Nome do produtor é obrigatório')).toBeInTheDocument();
      });

      // Corrigir o campo
      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      await act(async () => {
        await user.type(nomeInput, 'João Silva');
      });

      await waitFor(() => {
        expect(screen.queryByText('Nome do produtor é obrigatório')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submit do formulário', () => {
    it('deve chamar onSubmit com dados válidos', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);

      await act(async () => {
        await user.type(cpfInput, '12345678901');
      });

      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      await act(async () => {
        await user.type(nomeInput, 'João Silva');
      });

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          cpfCnpj: '123.456.789-01',
          nome: 'João Silva',
          fazendas: [],
        });
      });
    });

    it('deve chamar onCancel quando botão cancelar é clicado', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });

      await act(async () => {
        await user.click(cancelButton);
      });

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Dados iniciais', () => {
    it('deve preencher formulário com dados iniciais', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByDisplayValue('123.456.789-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
    });
  });

  describe('Estados de loading', () => {
    it('deve mostrar texto "Salvando..." quando está carregando', () => {
      renderWithTheme(<ProducerForm {...defaultProps} isLoading={true} />);

      expect(screen.getByRole('button', { name: /salvando/i })).toBeInTheDocument();
    });

    it('deve desabilitar todos os botões quando está carregando', () => {
      renderWithTheme(<ProducerForm {...defaultProps} isLoading={true} />);

      const submitButton = screen.getByRole('button', { name: /salvando/i });
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      const addFazendaButton = screen.getByRole('button', { name: /adicionar fazenda/i });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(addFazendaButton).toBeDisabled();
    });
  });

  describe('Gestão de fazendas', () => {
    it('deve adicionar uma nova fazenda ao clicar "Adicionar Fazenda"', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /adicionar fazenda/i });

      await act(async () => {
        await user.click(addButton);
      });

      // Verifica se campos da fazenda aparecem
      expect(screen.getByPlaceholderText(/Ex: Fazenda Santa Maria/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ex: Sorriso/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Selecione o estado')).toBeInTheDocument();
    });

    it('deve remover fazenda ao clicar botão remover', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Adicionar fazenda primeiro
      const addButton = screen.getByRole('button', { name: /adicionar fazenda/i });

      await act(async () => {
        await user.click(addButton);
      });

      // Verificar se fazenda foi adicionada
      expect(screen.getByPlaceholderText(/Ex: Fazenda Santa Maria/i)).toBeInTheDocument();

      // Remover fazenda
      const removeButton = screen.getByRole('button', { name: /remover fazenda/i });

      await act(async () => {
        await user.click(removeButton);
      });

      // Verificar se fazenda foi removida
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Ex: Fazenda Santa Maria/i)).not.toBeInTheDocument();
      });
    });

    it('deve atualizar dados da fazenda quando campos são alterados', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Adicionar fazenda
      const addButton = screen.getByRole('button', { name: /adicionar fazenda/i });

      await act(async () => {
        await user.click(addButton);
      });

      // Preencher campos da fazenda
      const nomeInput = screen.getByPlaceholderText(/Ex: Fazenda Santa Maria/i);

      await act(async () => {
        await user.type(nomeInput, 'Fazenda Teste');
      });

      const cidadeInput = screen.getByPlaceholderText(/Ex: Sorriso/i);

      await act(async () => {
        await user.type(cidadeInput, 'São Paulo');
      });

      expect(screen.getByDisplayValue('Fazenda Teste')).toBeInTheDocument();
      expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter inputs acessíveis via placeholder', () => {
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i);
      const nomeInput = screen.getByPlaceholderText(/Nome completo do produtor/i);

      expect(cpfInput).toBeInTheDocument();
      expect(nomeInput).toBeInTheDocument();
    });

    it('deve mostrar mensagens de erro', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /cadastrar/i });

      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CPF/CNPJ é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Nome do produtor é obrigatório')).toBeInTheDocument();
      });
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com dados iniciais parciais', () => {
      const initialData: Partial<ProducerFormData> = {
        nome: 'João Silva',
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/000\.000\.000-00 ou 00\.000\.000\/0000-00/i)).toHaveValue(
        ''
      );
    });

    it('deve lidar com fazendas nos dados iniciais', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda Inicial',
            cidade: 'São Paulo',
            estado: 'SP',
            areaTotal: 100,
            areaAgricultavel: 80,
            areaVegetacao: 20,
            safras: [],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByDisplayValue('Fazenda Inicial')).toBeInTheDocument();
      // Use getAllByDisplayValue para lidar com múltiplos elementos com mesmo valor
      const sãoPauloElements = screen.getAllByDisplayValue('São Paulo');
      expect(sãoPauloElements.length).toBeGreaterThan(0);
    });
  });

  describe('Gestão avançada de fazendas', () => {
    it('deve selecionar estado na fazenda', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Adicionar fazenda
      const addButton = screen.getByRole('button', { name: /adicionar fazenda/i });
      await act(async () => {
        await user.click(addButton);
      });

      // Selecionar estado
      const estadoSelect = screen.getByDisplayValue('Selecione o estado');
      await act(async () => {
        await user.selectOptions(estadoSelect, 'SP');
      });

      // Verificar se a opção está selecionada no select
      expect(estadoSelect).toHaveValue('SP');
    });

    it('deve preencher campos de área da fazenda', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ProducerForm {...defaultProps} />);

      // Adicionar fazenda
      const addButton = screen.getByRole('button', { name: /adicionar fazenda/i });
      await act(async () => {
        await user.click(addButton);
      });

      // Pegar todos os inputs com placeholder "0" e usar o primeiro (área total)
      const areaInputs = screen.getAllByPlaceholderText('0');
      const areaTotalInput = areaInputs[0]; // Primeiro é área total
      await act(async () => {
        await user.clear(areaTotalInput);
        await user.type(areaTotalInput, '100');
      });

      expect(areaTotalInput).toHaveValue(100);
    });

    it('deve lidar com fazendas com safras', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda com Safras',
            cidade: 'Sorriso',
            estado: 'MT',
            areaTotal: 1000,
            areaAgricultavel: 800,
            areaVegetacao: 200,
            safras: [
              {
                nome: 'Safra Verão 2024',
                ano: 2024,
                culturasPlantadas: ['Soja', 'Milho'],
              },
            ],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByText('Safra Verão 2024')).toBeInTheDocument();
      expect(screen.getByText('- Ano: 2024')).toBeInTheDocument();
      expect(screen.getByText('Soja')).toBeInTheDocument();
      expect(screen.getByText('Milho')).toBeInTheDocument();
    });

    it('deve mostrar fallback para safra sem nome', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda Teste',
            cidade: 'Teste',
            estado: 'SP',
            areaTotal: 100,
            areaAgricultavel: 80,
            areaVegetacao: 20,
            safras: [
              {
                nome: '',
                ano: 2024,
                culturasPlantadas: ['Soja'],
              },
            ],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByText('Safra 1')).toBeInTheDocument();
    });

    it('deve lidar com safra sem ano', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda Teste',
            cidade: 'Teste',
            estado: 'SP',
            areaTotal: 100,
            areaAgricultavel: 80,
            areaVegetacao: 20,
            safras: [
              {
                nome: 'Safra Sem Ano',
                ano: 0, // Ano 0 para simular ausência
                culturasPlantadas: ['Café'],
              },
            ],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByText('Safra Sem Ano')).toBeInTheDocument();
      expect(screen.getByText('Café')).toBeInTheDocument();
    });

    it('deve mostrar mensagem para safra sem culturas', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda Teste',
            cidade: 'Teste',
            estado: 'SP',
            areaTotal: 100,
            areaAgricultavel: 80,
            areaVegetacao: 20,
            safras: [
              {
                nome: 'Safra Sem Culturas',
                ano: 2024,
                culturasPlantadas: [],
              },
            ],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByText('Safra Sem Culturas')).toBeInTheDocument();
      expect(screen.getByText('Nenhuma cultura cadastrada')).toBeInTheDocument();
    });

    it('deve renderizar múltiplas fazendas nos dados iniciais', () => {
      const initialData: Partial<ProducerFormData> = {
        cpfCnpj: '123.456.789-01',
        nome: 'João Silva',
        fazendas: [
          {
            nomeFazenda: 'Fazenda 1',
            cidade: 'Cidade 1',
            estado: 'SP',
            areaTotal: 100,
            areaAgricultavel: 80,
            areaVegetacao: 20,
            safras: [],
          },
          {
            nomeFazenda: 'Fazenda 2',
            cidade: 'Cidade 2',
            estado: 'MG',
            areaTotal: 200,
            areaAgricultavel: 150,
            areaVegetacao: 50,
            safras: [],
          },
        ],
      };

      renderWithTheme(<ProducerForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByDisplayValue('Fazenda 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Fazenda 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cidade 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cidade 2')).toBeInTheDocument();
    });
  });
});
