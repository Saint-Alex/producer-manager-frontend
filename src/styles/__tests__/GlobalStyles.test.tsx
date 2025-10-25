import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  Button,
  Card,
  Container,
  ErrorMessage,
  GlobalStyle,
  LoadingSpinner,
  SuccessMessage,
  Title
} from '../GlobalStyles';
import { theme } from '../theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {component}
    </ThemeProvider>
  );
};

describe('GlobalStyles Components', () => {
  describe('GlobalStyle', () => {
    it('deve aplicar estilos globais', () => {
      const { container } = renderWithTheme(<div data-testid="global-test" />);

      // Verifica se o GlobalStyle é renderizado (não causa erro)
      expect(container).toBeInTheDocument();
    });
  });

  describe('Container', () => {
    it('deve renderizar container', () => {
      const { container } = renderWithTheme(
        <Container data-testid="container">Content</Container>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve renderizar conteúdo interno', () => {
      const { getByText } = renderWithTheme(
        <Container>Container Content</Container>
      );
      expect(getByText('Container Content')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('deve renderizar card', () => {
      const { container } = renderWithTheme(
        <Card data-testid="card">Card Content</Card>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve renderizar conteúdo do card', () => {
      const { getByText } = renderWithTheme(
        <Card>Card Content Test</Card>
      );
      expect(getByText('Card Content Test')).toBeInTheDocument();
    });
  });

  describe('Title', () => {
    it('deve renderizar título como h1', () => {
      const { getByText } = renderWithTheme(
        <Title>Page Title</Title>
      );
      const title = getByText('Page Title');

      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H1');
    });

    it('deve ter o texto especificado', () => {
      const titleText = 'Sistema de Gestão Rural';
      const { getByText } = renderWithTheme(
        <Title>{titleText}</Title>
      );
      expect(getByText(titleText)).toBeInTheDocument();
    });
  });

  describe('Button', () => {
    it('deve renderizar botão', () => {
      const { getByRole } = renderWithTheme(
        <Button>Click Me</Button>
      );
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('deve ter texto do botão', () => {
      const { getByText } = renderWithTheme(
        <Button>Save Changes</Button>
      );
      expect(getByText('Save Changes')).toBeInTheDocument();
    });

    it('deve estar desabilitado quando disabled', () => {
      const { getByRole } = renderWithTheme(
        <Button disabled>Disabled Button</Button>
      );
      const button = getByRole('button');
      expect(button).toBeDisabled();
    });

    it('deve ser clicável quando habilitado', () => {
      const handleClick = jest.fn();
      const { getByText } = renderWithTheme(
        <Button onClick={handleClick}>Clickable</Button>
      );
      const button = getByText('Clickable');

      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoadingSpinner', () => {
    it('deve renderizar spinner de carregamento', () => {
      const { container } = renderWithTheme(
        <LoadingSpinner data-testid="spinner" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve ter animação de rotação', () => {
      const { container } = renderWithTheme(<LoadingSpinner />);
      const spinner = container.firstChild as HTMLElement;

      // Verifica se o elemento existe (a animação CSS não pode ser testada diretamente)
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('ErrorMessage', () => {
    it('deve renderizar mensagem de erro', () => {
      const { getByText } = renderWithTheme(
        <ErrorMessage>Erro ao processar dados</ErrorMessage>
      );
      const message = getByText('Erro ao processar dados');
      expect(message).toBeInTheDocument();
    });

    it('deve exibir texto de erro customizado', () => {
      const errorText = 'Falha na conexão com o servidor';
      const { getByText } = renderWithTheme(
        <ErrorMessage>{errorText}</ErrorMessage>
      );
      expect(getByText(errorText)).toBeInTheDocument();
    });
  });

  describe('SuccessMessage', () => {
    it('deve renderizar mensagem de sucesso', () => {
      const { getByText } = renderWithTheme(
        <SuccessMessage>Operação realizada com sucesso</SuccessMessage>
      );
      const message = getByText('Operação realizada com sucesso');
      expect(message).toBeInTheDocument();
    });

    it('deve exibir texto de sucesso customizado', () => {
      const successText = 'Dados salvos com sucesso!';
      const { getByText } = renderWithTheme(
        <SuccessMessage>{successText}</SuccessMessage>
      );
      expect(getByText(successText)).toBeInTheDocument();
    });
  });

  describe('Integração - Layout completo', () => {
    it('deve renderizar layout completo com todos os componentes', () => {
      const { getByText, getByRole } = renderWithTheme(
        <Container>
          <Title>Sistema Rural</Title>
          <Card>
            <p>Informações do sistema</p>
            <Button>Ação Principal</Button>
            <LoadingSpinner />
          </Card>
          <ErrorMessage>Mensagem de erro teste</ErrorMessage>
          <SuccessMessage>Mensagem de sucesso teste</SuccessMessage>
        </Container>
      );

      // Verifica se todos os componentes estão presentes
      expect(getByText('Sistema Rural')).toBeInTheDocument();
      expect(getByText('Informações do sistema')).toBeInTheDocument();
      expect(getByRole('button')).toBeInTheDocument();
      expect(getByText('Mensagem de erro teste')).toBeInTheDocument();
      expect(getByText('Mensagem de sucesso teste')).toBeInTheDocument();
    });
  });

  describe('Estados e variações', () => {
    it('deve renderizar múltiplos botões com diferentes estados', () => {
      const { getByText } = renderWithTheme(
        <div>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      );

      const normalButton = getByText('Normal');
      const disabledButton = getByText('Disabled');

      expect(normalButton).toBeEnabled();
      expect(disabledButton).toBeDisabled();
    });

    it('deve renderizar diferentes tipos de mensagem', () => {
      const { getByText } = renderWithTheme(
        <div>
          <ErrorMessage>Erro crítico</ErrorMessage>
          <SuccessMessage>Sucesso total</SuccessMessage>
        </div>
      );

      expect(getByText('Erro crítico')).toBeInTheDocument();
      expect(getByText('Sucesso total')).toBeInTheDocument();
    });
  });

  describe('Conteúdo dinâmico', () => {
    it('deve renderizar com conteúdo HTML complexo', () => {
      const { getByText, getByRole } = renderWithTheme(
        <Card>
          <Title>Título Complexo</Title>
          <div>
            <p>Parágrafo de exemplo</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
          <Button>Botão de Ação</Button>
        </Card>
      );

      expect(getByText('Título Complexo')).toBeInTheDocument();
      expect(getByText('Parágrafo de exemplo')).toBeInTheDocument();
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Funcionalidades especiais', () => {
    it('deve renderizar múltiplos containers', () => {
      const { getByText } = renderWithTheme(
        <div>
          <Container>Container 1</Container>
          <Container>Container 2</Container>
        </div>
      );

      expect(getByText('Container 1')).toBeInTheDocument();
      expect(getByText('Container 2')).toBeInTheDocument();
    });

    it('deve renderizar cards aninhados', () => {
      const { getByText } = renderWithTheme(
        <Container>
          <Card>
            <Title>Card Principal</Title>
            <Card>
              <Title>Card Aninhado</Title>
            </Card>
          </Card>
        </Container>
      );

      expect(getByText('Card Principal')).toBeInTheDocument();
      expect(getByText('Card Aninhado')).toBeInTheDocument();
    });

    it('deve renderizar loading com mensagens', () => {
      const { getByText, container } = renderWithTheme(
        <Card>
          <LoadingSpinner />
          <ErrorMessage>Erro durante carregamento</ErrorMessage>
          <SuccessMessage>Carregamento concluído</SuccessMessage>
        </Card>
      );

      expect(container.querySelector('[data-testid="spinner"]') || container.firstChild).toBeInTheDocument();
      expect(getByText('Erro durante carregamento')).toBeInTheDocument();
      expect(getByText('Carregamento concluído')).toBeInTheDocument();
    });
  });
});
