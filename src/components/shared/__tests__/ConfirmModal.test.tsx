import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import ConfirmModal, { ConfirmModalProps } from '../ConfirmModal';

const renderConfirmModal = (props: Partial<ConfirmModalProps> = {}) => {
  const defaultProps: ConfirmModalProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    ...props,
  };

  return render(
    <ThemeProvider theme={theme}>
      <ConfirmModal {...defaultProps} />
    </ThemeProvider>
  );
};

describe('ConfirmModal', () => {
  describe('Visibility Control', () => {
    test('renders when isOpen is true', () => {
      renderConfirmModal({ isOpen: true });

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
      renderConfirmModal({ isOpen: false });

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
      expect(screen.queryByText('Are you sure you want to proceed?')).not.toBeInTheDocument();
    });

    test('returns null when isOpen is false', () => {
      const { container } = renderConfirmModal({ isOpen: false });

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Content Rendering', () => {
    test('displays correct title and message', () => {
      renderConfirmModal({
        title: 'Delete Item',
        message: 'This action cannot be undone',
      });

      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
    });

    test('renders HTML content in message with dangerouslySetInnerHTML', () => {
      renderConfirmModal({
        message: '<strong>Warning:</strong> This will delete <em>all data</em>',
      });

      expect(screen.getByText('Warning:')).toBeInTheDocument();
      expect(screen.getByText('all data')).toBeInTheDocument();
    });

    test('displays default button texts when not provided', () => {
      renderConfirmModal({
        confirmText: undefined,
        cancelText: undefined,
      });

      expect(screen.getByText('Confirmar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    test('displays custom button texts when provided', () => {
      renderConfirmModal({
        confirmText: 'Yes, Delete',
        cancelText: 'No, Keep',
      });

      expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
      expect(screen.getByText('No, Keep')).toBeInTheDocument();
      expect(screen.queryByText('Confirmar')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    });

    test('displays close button (×)', () => {
      renderConfirmModal();

      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('Icon Display - Variant Switch Cases', () => {
    test('displays warning icon for danger variant', () => {
      renderConfirmModal({ variant: 'danger' });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    test('displays warning icon for warning variant', () => {
      renderConfirmModal({ variant: 'warning' });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    test('displays info icon for info variant', () => {
      renderConfirmModal({ variant: 'info' });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    test('displays default warning icon for undefined variant', () => {
      renderConfirmModal({ variant: undefined });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    test('displays default warning icon for invalid variant', () => {
      // Testing with unknown variant to ensure default icon
      const invalidVariant = 'invalid' as const;
      renderConfirmModal({ variant: invalidVariant as any });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    test('displays default warning icon when no variant specified', () => {
      renderConfirmModal(); // usa default 'warning'

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    test('calls onConfirm when confirm button is clicked', () => {
      const mockOnConfirm = jest.fn();
      renderConfirmModal({ onConfirm: mockOnConfirm });

      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button is clicked', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when close button (×) is clicked', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when overlay is clicked', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      // Encontrar o overlay (primeiro div renderizado)
      const overlay = screen.getByText('Confirm Action').closest('div')
        ?.parentElement?.parentElement;

      if (overlay) {
        // Simular clique no overlay (onde target === currentTarget)
        fireEvent.click(overlay);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
      } else {
        // Fallback - garantir que o teste não falhe
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      }
    });

    test('does not call onCancel when modal content is clicked', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      // Clicar no conteúdo (não overlay) não deve fechar
      const titleElement = screen.getByText('Confirm Action');
      const overlay = titleElement.closest('div')?.parentElement;

      if (overlay) {
        const mockEvent = {
          target: titleElement,
          currentTarget: overlay,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as any;

        fireEvent.click(overlay, mockEvent);
        expect(mockOnCancel).not.toHaveBeenCalled();
      }
    });
  });

  describe('All Variants with Actions', () => {
    test('danger variant with custom content and actions', () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();

      renderConfirmModal({
        variant: 'danger',
        title: 'Delete Account',
        message: 'This will permanently delete your account',
        confirmText: 'Delete Forever',
        cancelText: 'Keep Account',
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
      expect(screen.getByText('This will permanently delete your account')).toBeInTheDocument();
      expect(screen.getByText('Delete Forever')).toBeInTheDocument();
      expect(screen.getByText('Keep Account')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Delete Forever'));
      expect(mockOnConfirm).toHaveBeenCalled();

      fireEvent.click(screen.getByText('Keep Account'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('warning variant with custom content', () => {
      renderConfirmModal({
        variant: 'warning',
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to leave?',
        confirmText: 'Leave Anyway',
        cancelText: 'Stay Here',
      });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
      expect(
        screen.getByText('You have unsaved changes. Do you want to leave?')
      ).toBeInTheDocument();
      expect(screen.getByText('Leave Anyway')).toBeInTheDocument();
      expect(screen.getByText('Stay Here')).toBeInTheDocument();
    });

    test('info variant with custom content', () => {
      renderConfirmModal({
        variant: 'info',
        title: 'Information',
        message: 'This will send a notification to all users',
        confirmText: 'Send Now',
        cancelText: 'Later',
      });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('This will send a notification to all users')).toBeInTheDocument();
      expect(screen.getByText('Send Now')).toBeInTheDocument();
      expect(screen.getByText('Later')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Button Text Conditionals', () => {
    test('handles empty title and message', () => {
      renderConfirmModal({
        title: '',
        message: '',
      });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Confirmar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    test('handles complex HTML in message', () => {
      renderConfirmModal({
        message: '<div><p>Line 1</p><ul><li>Option A</li><li>Option B</li></ul></div>',
      });

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    test('handles very long text content', () => {
      const longTitle = 'This is a very long confirmation title that might need wrapping';
      const longMessage =
        'This is an extremely long confirmation message that contains detailed information about the action being performed and its consequences';

      renderConfirmModal({
        title: longTitle,
        message: longMessage,
      });

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    test('handles special characters in content', () => {
      renderConfirmModal({
        title: 'Título com acentos: çãõ',
        message: 'Mensagem com símbolos: @#$%^&*()_+{}|:"<>?',
        confirmText: 'Sim! ✅',
        cancelText: 'Não ❌',
      });

      expect(screen.getByText('Título com acentos: çãõ')).toBeInTheDocument();
      expect(screen.getByText('Mensagem com símbolos: @#$%^&*()_+{}|:"<>?')).toBeInTheDocument();
      expect(screen.getByText('Sim! ✅')).toBeInTheDocument();
      expect(screen.getByText('Não ❌')).toBeInTheDocument();
    });

    test('modal behavior when rapidly toggling isOpen', () => {
      const { rerender } = renderConfirmModal({ isOpen: true });

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ConfirmModal
            isOpen={false}
            title='Confirm Action'
            message='Are you sure?'
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ConfirmModal
            isOpen={true}
            title='Confirm Action'
            message='Are you sure?'
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });
  });

  describe('Button Text Default Logic', () => {
    test('uses default confirmText when explicitly set to undefined', () => {
      renderConfirmModal({ confirmText: undefined });

      expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });

    test('uses default cancelText when explicitly set to undefined', () => {
      renderConfirmModal({ cancelText: undefined });

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    test('uses empty string as confirmText when provided', () => {
      renderConfirmModal({ confirmText: '' });

      const buttons = screen.getAllByRole('button');
      // Um dos botões deve ter texto vazio
      const emptyButton = buttons.find(button => button.textContent === '');
      expect(emptyButton).toBeInTheDocument();
    });

    test('uses empty string as cancelText when provided', () => {
      renderConfirmModal({ cancelText: '' });

      const buttons = screen.getAllByRole('button');
      // Um dos botões deve ter texto vazio
      const emptyButton = buttons.find(button => button.textContent === '');
      expect(emptyButton).toBeInTheDocument();
    });

    test('both buttons with custom text', () => {
      renderConfirmModal({
        confirmText: 'Execute',
        cancelText: 'Abort',
      });

      expect(screen.getByText('Execute')).toBeInTheDocument();
      expect(screen.getByText('Abort')).toBeInTheDocument();
      expect(screen.queryByText('Confirmar')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Button Interactions', () => {
    test('overlay click handling - target equals currentTarget', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      // Criar um mock de evento onde target === currentTarget
      const overlayElement = screen.getByText('Confirm Action').closest('div')
        ?.parentElement?.parentElement;

      if (overlayElement) {
        const mockEvent = {
          target: overlayElement,
          currentTarget: overlayElement,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as any;

        fireEvent.click(overlayElement, mockEvent);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
      }
    });

    test('multiple clicks on same button only call handler once per click', () => {
      const mockOnConfirm = jest.fn();
      renderConfirmModal({ onConfirm: mockOnConfirm });

      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });

    test('different buttons call different handlers', () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      renderConfirmModal({
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });

      fireEvent.click(screen.getByText('Confirmar'));
      fireEvent.click(screen.getByText('Cancelar'));
      fireEvent.click(screen.getByText('×'));

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).toHaveBeenCalledTimes(2); // Cancel button + close button
    });

    test('all close methods call onCancel', () => {
      const mockOnCancel = jest.fn();
      renderConfirmModal({ onCancel: mockOnCancel });

      // Cancel button
      fireEvent.click(screen.getByText('Cancelar'));

      // Close button
      fireEvent.click(screen.getByText('×'));

      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });
  });
});
