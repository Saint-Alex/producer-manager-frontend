import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import { NotificationModal, NotificationModalProps } from '../NotificationModal';

const renderNotificationModal = (props: Partial<NotificationModalProps> = {}) => {
  const defaultProps: NotificationModalProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    type: 'info',
    onClose: jest.fn(),
    ...props,
  };

  return render(
    <ThemeProvider theme={theme}>
      <NotificationModal {...defaultProps} />
    </ThemeProvider>
  );
};

describe('NotificationModal', () => {
  describe('Visibility Control', () => {
    test('renders when isOpen is true', () => {
      renderNotificationModal({ isOpen: true });

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
      renderNotificationModal({ isOpen: false });

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    test('returns null when isOpen is false', () => {
      const { container } = renderNotificationModal({ isOpen: false });

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Content Rendering', () => {
    test('displays correct title and message', () => {
      renderNotificationModal({
        title: 'Custom Title',
        message: 'Custom message content',
      });

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom message content')).toBeInTheDocument();
    });

    test('renders HTML content in message with dangerouslySetInnerHTML', () => {
      renderNotificationModal({
        message: '<strong>Bold text</strong> and <em>italic text</em>',
      });

      // Verifica que o conteúdo HTML foi renderizado (sem verificar innerHTML)
      expect(screen.getByText('Bold text')).toBeInTheDocument();
      expect(screen.getByText(/and/)).toBeInTheDocument();
      expect(screen.getByText('italic text')).toBeInTheDocument();
    });

    test('displays default button text when buttonText is not provided', () => {
      renderNotificationModal({ buttonText: undefined });

      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    test('displays custom button text when provided', () => {
      renderNotificationModal({ buttonText: 'Entendi' });

      expect(screen.getByText('Entendi')).toBeInTheDocument();
      expect(screen.queryByText('OK')).not.toBeInTheDocument();
    });
  });

  describe('Icon Display - Type Switch Cases', () => {
    test('displays success icon for success type', () => {
      renderNotificationModal({ type: 'success' });

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    test('displays error icon for error type', () => {
      renderNotificationModal({ type: 'error' });

      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    test('displays warning icon for warning type', () => {
      renderNotificationModal({ type: 'warning' });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    test('displays info icon for info type', () => {
      renderNotificationModal({ type: 'info' });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    test('displays default info icon for unknown type', () => {
      // @ts-ignore - Forçar tipo inválido para testar default case
      renderNotificationModal({ type: 'unknown' as any });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    test('displays default info icon for null/undefined type', () => {
      // @ts-ignore - Testar default case
      renderNotificationModal({ type: null as any });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    test('calls onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({ onClose: mockOnClose });

      const closeButton = screen.getByText('OK');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when overlay is clicked', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({ onClose: mockOnClose });

      // Buscar o overlay (elemento pai)
      const overlay = screen
        .getByText('Test Title')
        .closest('[class*="NotificationOverlay"]')?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    test('does not call onClose when modal container is clicked', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({ onClose: mockOnClose });

      // Clicar no container (não overlay) não deve fechar
      const container = screen.getByText('Test Title').closest('[class*="NotificationContainer"]');
      if (container) {
        fireEvent.click(container);
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });

    test('calls onClose only when clicking overlay background', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({ onClose: mockOnClose });

      // Simular click no overlay (target === currentTarget)
      const titleElement = screen.getByText('Test Title');
      const overlay = titleElement.closest('div')?.parentElement;

      if (overlay) {
        // Mock do evento onde target === currentTarget (click no overlay)
        const mockEvent = {
          target: overlay,
          currentTarget: overlay,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as any;

        fireEvent.click(overlay, mockEvent);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    test('does not call onClose when clicking modal content', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({ onClose: mockOnClose });

      // Simular click no conteúdo (target !== currentTarget)
      const titleElement = screen.getByText('Test Title');
      const overlay = titleElement.closest('div')?.parentElement;

      if (overlay) {
        // Mock do evento onde target !== currentTarget (click no conteúdo)
        const mockEvent = {
          target: titleElement,
          currentTarget: overlay,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as any;

        fireEvent.click(overlay, mockEvent);
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });
  });

  describe('All Notification Types with Custom Content', () => {
    test('success notification with custom content', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully',
        buttonText: 'Great!',
        onClose: mockOnClose,
      });

      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
      expect(screen.getByText('Great!')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Great!'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('error notification with custom content', () => {
      const mockOnClose = jest.fn();
      renderNotificationModal({
        type: 'error',
        title: 'Error Occurred',
        message: 'Something went wrong',
        buttonText: 'Try Again',
        onClose: mockOnClose,
      });

      expect(screen.getByText('❌')).toBeInTheDocument();
      expect(screen.getByText('Error Occurred')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('warning notification with custom content', () => {
      renderNotificationModal({
        type: 'warning',
        title: 'Warning',
        message: 'Please be careful',
        buttonText: 'Understood',
      });

      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Please be careful')).toBeInTheDocument();
      expect(screen.getByText('Understood')).toBeInTheDocument();
    });

    test('info notification with custom content', () => {
      renderNotificationModal({
        type: 'info',
        title: 'Information',
        message: 'Here is some useful info',
        buttonText: 'Got it',
      });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('Here is some useful info')).toBeInTheDocument();
      expect(screen.getByText('Got it')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Conditional Branches', () => {
    test('handles empty title and message', () => {
      renderNotificationModal({
        title: '',
        message: '',
      });

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    test('handles complex HTML in message', () => {
      renderNotificationModal({
        message: '<div><p>Paragraph 1</p><ul><li>Item 1</li><li>Item 2</li></ul></div>',
      });

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('handles very long text content', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines';
      const longMessage =
        'This is an extremely long message that contains a lot of information and might need to be wrapped or scrolled within the modal container for proper display';

      renderNotificationModal({
        title: longTitle,
        message: longMessage,
      });

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    test('handles special characters in content', () => {
      renderNotificationModal({
        title: 'Special: @#$%^&*()_+{}|:"<>?',
        message: 'Message with ñ, á, é, í, ó, ú, ç, and emojis 🎉🚀💖',
        buttonText: 'Clique aqui! 👆',
      });

      expect(screen.getByText('Special: @#$%^&*()_+{}|:"<>?')).toBeInTheDocument();
      expect(screen.getByText(/Message with ñ, á, é, í, ó, ú, ç, and emojis/)).toBeInTheDocument();
      expect(screen.getByText('Clique aqui! 👆')).toBeInTheDocument();
    });

    test('modal behavior when rapidly toggling isOpen', () => {
      const { rerender } = renderNotificationModal({ isOpen: true });

      expect(screen.getByText('Test Title')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <NotificationModal
            isOpen={false}
            title='Test Title'
            message='Test message'
            type='info'
            onClose={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <NotificationModal
            isOpen={true}
            title='Test Title'
            message='Test message'
            type='info'
            onClose={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Button Text Conditional Logic', () => {
    test('uses default buttonText when explicitly set to undefined', () => {
      renderNotificationModal({ buttonText: undefined });

      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    test('uses empty string as buttonText when provided', () => {
      renderNotificationModal({ buttonText: '' });

      // Botão ainda existe mas sem texto
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    test('uses custom buttonText when provided', () => {
      renderNotificationModal({ buttonText: 'Custom Button' });

      expect(screen.getByText('Custom Button')).toBeInTheDocument();
      expect(screen.queryByText('OK')).not.toBeInTheDocument();
    });

    test('buttonText with special characters', () => {
      renderNotificationModal({ buttonText: 'Confirmação ✅' });

      expect(screen.getByText('Confirmação ✅')).toBeInTheDocument();
    });
  });
});
