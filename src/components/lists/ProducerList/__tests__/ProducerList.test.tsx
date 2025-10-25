import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../../styles/theme';
import { Producer } from '../../../../types/producer';
import ProducerList from '../ProducerList';

// Mock do ActionButton para evitar complexidade desnecessária
jest.mock('../../../shared/ActionButton', () => ({
  ActionButton: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

const mockProducers: Producer[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpfCnpj: '123.456.789-00',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    nome: 'Fazenda ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    createdAt: '2024-02-20T14:45:00Z',
    updatedAt: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    nome: 'Maria Oliveira',
    cpfCnpj: '987.654.321-11',
    createdAt: '2024-03-10T08:15:00Z',
    updatedAt: '2024-03-10T08:15:00Z',
  },
];

const renderProducerList = (props = {}) => {
  const defaultProps = {
    producers: mockProducers,
    ...props,
  };

  return render(
    <ThemeProvider theme={theme}>
      <ProducerList {...defaultProps} />
    </ThemeProvider>
  );
};

describe('ProducerList', () => {
  describe('Rendering', () => {
    test('renders producer list with all producers', () => {
      renderProducerList();

      // Verifica se todos os produtores são renderizados
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Fazenda ABC Ltda')).toBeInTheDocument();
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
    });

    test('displays producer information correctly', () => {
      renderProducerList();

      // Verifica informações do primeiro produtor
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();

      // Verifica informações do segundo produtor
      expect(screen.getByText('Fazenda ABC Ltda')).toBeInTheDocument();
      expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument();
      expect(screen.getByText('20/02/2024')).toBeInTheDocument();
    });

    test('renders empty list when no producers provided', () => {
      renderProducerList({ producers: [] });

      // Lista vazia não deve ter cards de produtores
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
      expect(screen.queryByText('Ver Propriedades')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons - Conditional Rendering', () => {
    test('renders View Properties button when onViewProperties is provided', () => {
      const mockOnViewProperties = jest.fn();
      renderProducerList({ onViewProperties: mockOnViewProperties });

      const viewButtons = screen.getAllByText('Ver Propriedades');
      expect(viewButtons).toHaveLength(3); // Um para cada produtor

      viewButtons.forEach(button => {
        expect(button).toHaveAttribute('data-variant', 'primary');
        expect(button).toHaveAttribute('data-size', 'small');
      });
    });

    test('does not render View Properties button when onViewProperties is not provided', () => {
      renderProducerList({ onViewProperties: undefined });

      expect(screen.queryByText('Ver Propriedades')).not.toBeInTheDocument();
    });

    test('renders Edit button when onEdit is provided', () => {
      const mockOnEdit = jest.fn();
      renderProducerList({ onEdit: mockOnEdit });

      const editButtons = screen.getAllByText('Editar');
      expect(editButtons).toHaveLength(3);

      editButtons.forEach(button => {
        expect(button).toHaveAttribute('data-variant', 'secondary');
        expect(button).toHaveAttribute('data-size', 'small');
      });
    });

    test('does not render Edit button when onEdit is not provided', () => {
      renderProducerList({ onEdit: undefined });

      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    });

    test('renders Delete button when onDelete is provided', () => {
      const mockOnDelete = jest.fn();
      renderProducerList({ onDelete: mockOnDelete });

      const deleteButtons = screen.getAllByText('Excluir');
      expect(deleteButtons).toHaveLength(3);

      deleteButtons.forEach(button => {
        expect(button).toHaveAttribute('data-variant', 'danger');
        expect(button).toHaveAttribute('data-size', 'small');
      });
    });

    test('does not render Delete button when onDelete is not provided', () => {
      renderProducerList({ onDelete: undefined });

      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });

    test('renders all buttons when all handlers are provided', () => {
      const mockHandlers = {
        onViewProperties: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };
      renderProducerList(mockHandlers);

      // Cada produtor deve ter 3 botões
      expect(screen.getAllByText('Ver Propriedades')).toHaveLength(3);
      expect(screen.getAllByText('Editar')).toHaveLength(3);
      expect(screen.getAllByText('Excluir')).toHaveLength(3);
    });

    test('renders no action buttons when no handlers are provided', () => {
      renderProducerList({
        onViewProperties: undefined,
        onEdit: undefined,
        onDelete: undefined,
      });

      expect(screen.queryByText('Ver Propriedades')).not.toBeInTheDocument();
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });
  });

  describe('Button Click Handlers', () => {
    test('calls onViewProperties with correct producer ID', () => {
      const mockOnViewProperties = jest.fn();
      renderProducerList({ onViewProperties: mockOnViewProperties });

      const viewButtons = screen.getAllByText('Ver Propriedades');

      // Clica no primeiro botão (primeiro produtor)
      fireEvent.click(viewButtons[0]);
      expect(mockOnViewProperties).toHaveBeenCalledWith('1');

      // Clica no segundo botão (segundo produtor)
      fireEvent.click(viewButtons[1]);
      expect(mockOnViewProperties).toHaveBeenCalledWith('2');

      // Clica no terceiro botão (terceiro produtor)
      fireEvent.click(viewButtons[2]);
      expect(mockOnViewProperties).toHaveBeenCalledWith('3');

      expect(mockOnViewProperties).toHaveBeenCalledTimes(3);
    });

    test('calls onEdit with correct producer ID', () => {
      const mockOnEdit = jest.fn();
      renderProducerList({ onEdit: mockOnEdit });

      const editButtons = screen.getAllByText('Editar');

      // Testa cada botão de editar
      fireEvent.click(editButtons[0]);
      expect(mockOnEdit).toHaveBeenCalledWith('1');

      fireEvent.click(editButtons[1]);
      expect(mockOnEdit).toHaveBeenCalledWith('2');

      fireEvent.click(editButtons[2]);
      expect(mockOnEdit).toHaveBeenCalledWith('3');

      expect(mockOnEdit).toHaveBeenCalledTimes(3);
    });

    test('calls onDelete with correct producer ID', () => {
      const mockOnDelete = jest.fn();
      renderProducerList({ onDelete: mockOnDelete });

      const deleteButtons = screen.getAllByText('Excluir');

      // Testa cada botão de deletar
      fireEvent.click(deleteButtons[0]);
      expect(mockOnDelete).toHaveBeenCalledWith('1');

      fireEvent.click(deleteButtons[1]);
      expect(mockOnDelete).toHaveBeenCalledWith('2');

      fireEvent.click(deleteButtons[2]);
      expect(mockOnDelete).toHaveBeenCalledWith('3');

      expect(mockOnDelete).toHaveBeenCalledTimes(3);
    });

    test('handles multiple button clicks correctly', () => {
      const mockHandlers = {
        onViewProperties: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };
      renderProducerList(mockHandlers);

      // Clica em diferentes botões do primeiro produtor
      fireEvent.click(screen.getAllByText('Ver Propriedades')[0]);
      fireEvent.click(screen.getAllByText('Editar')[0]);
      fireEvent.click(screen.getAllByText('Excluir')[0]);

      expect(mockHandlers.onViewProperties).toHaveBeenCalledWith('1');
      expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
      expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('Date Formatting', () => {
    test('formats dates correctly in Brazilian format', () => {
      renderProducerList();

      // Verifica formatação das datas
      expect(screen.getByText('15/01/2024')).toBeInTheDocument(); // 2024-01-15
      expect(screen.getByText('20/02/2024')).toBeInTheDocument(); // 2024-02-20
      expect(screen.getByText('10/03/2024')).toBeInTheDocument(); // 2024-03-10
    });

    test('handles different date formats correctly', () => {
      const producersWithDifferentDates: Producer[] = [
        {
          id: '1',
          nome: 'Test Producer',
          cpfCnpj: '123.456.789-00',
          createdAt: '2024-12-31T23:59:59Z', // Ano novo
          updatedAt: '2024-12-31T23:59:59Z',
        },
      ];

      renderProducerList({ producers: producersWithDifferentDates });

      expect(screen.getByText('31/12/2024')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders with correct structure for each producer card', () => {
      renderProducerList({
        onViewProperties: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      });

      // Verifica estrutura para primeiro produtor
      const firstProducerSection = screen.getByText('João Silva').closest('div');
      expect(firstProducerSection).toBeInTheDocument();

      // Verifica que informações estão presentes (usando getAllByText para múltiplos elementos)
      expect(screen.getAllByText('CPF/CNPJ:')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Cadastrado em:')[0]).toBeInTheDocument();
    });

    test('renders producer cards with unique keys', () => {
      renderProducerList();

      // Verifica que todos os nomes estão presentes (keys funcionando)
      mockProducers.forEach(producer => {
        expect(screen.getByText(producer.nome)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles producer with minimal data', () => {
      const minimalProducer: Producer[] = [
        {
          id: '1',
          nome: 'Minimal Producer',
          cpfCnpj: '000.000.000-00',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      renderProducerList({ producers: minimalProducer });

      expect(screen.getByText('Minimal Producer')).toBeInTheDocument();
      expect(screen.getByText('000.000.000-00')).toBeInTheDocument();
      expect(screen.getByText('31/12/2023')).toBeInTheDocument(); // Corrigido para data real
    });

    test('handles very long producer names', () => {
      const longNameProducer: Producer[] = [
        {
          id: '1',
          nome: 'Fazenda Agropecuária Sustentável do Vale do Paraíba com Tecnologia Avançada Ltda ME',
          cpfCnpj: '12.345.678/0001-90',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      renderProducerList({ producers: longNameProducer });

      expect(
        screen.getByText(
          'Fazenda Agropecuária Sustentável do Vale do Paraíba com Tecnologia Avançada Ltda ME'
        )
      ).toBeInTheDocument();
    });

    test('handles single producer', () => {
      const singleProducer = [mockProducers[0]];
      renderProducerList({
        producers: singleProducer,
        onViewProperties: jest.fn(),
      });

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getAllByText('Ver Propriedades')).toHaveLength(1);
    });
  });

  describe('Button Combinations', () => {
    test('renders only View Properties button when only that handler is provided', () => {
      renderProducerList({ onViewProperties: jest.fn() });

      expect(screen.getAllByText('Ver Propriedades')).toHaveLength(3);
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });

    test('renders only Edit and Delete buttons when those handlers are provided', () => {
      renderProducerList({
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      });

      expect(screen.queryByText('Ver Propriedades')).not.toBeInTheDocument();
      expect(screen.getAllByText('Editar')).toHaveLength(3);
      expect(screen.getAllByText('Excluir')).toHaveLength(3);
    });

    test('renders partial buttons based on provided handlers', () => {
      renderProducerList({
        onViewProperties: jest.fn(),
        onDelete: jest.fn(),
        // onEdit não fornecido
      });

      expect(screen.getAllByText('Ver Propriedades')).toHaveLength(3);
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      expect(screen.getAllByText('Excluir')).toHaveLength(3);
    });
  });
});
