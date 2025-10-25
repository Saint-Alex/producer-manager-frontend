import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import {
  BackButton,
  ContentSection,
  EmptyMessage,
  ErrorMessage,
  LoadingMessage,
  PageContainer,
  PageHeader,
  PageTitle,
  PropriedadeActions,
  PropriedadeCard,
  PropriedadeInfo,
  PropriedadeName
} from '../PropriedadesPage.styled';

// Helper function to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PropriedadesPage Styled Components', () => {
  describe('PageContainer', () => {
    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PageContainer>Test Content</PageContainer>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should display children content', () => {
      const { getByText } = renderWithTheme(
        <PageContainer>Test Content</PageContainer>
      );
      expect(getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('PageHeader', () => {
    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PageHeader>Header Content</PageHeader>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      const { getByText } = renderWithTheme(
        <PageHeader>Header Content</PageHeader>
      );
      expect(getByText('Header Content')).toBeInTheDocument();
    });
  });

  describe('BackButton', () => {
    it('should render as button element', () => {
      const { container } = renderWithTheme(
        <BackButton onClick={() => { }}>Back</BackButton>
      );
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.nodeName).toBe('BUTTON');
    });

    it('should handle click events', () => {
      const mockClick = jest.fn();
      const { getByText } = renderWithTheme(
        <BackButton onClick={mockClick}>Back</BackButton>
      );

      getByText('Back').click();
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should be clickable', () => {
      const { getByText } = renderWithTheme(
        <BackButton onClick={() => { }}>Back</BackButton>
      );
      expect(getByText('Back')).toBeInTheDocument();
    });
  });

  describe('PageTitle', () => {
    it('should render title text', () => {
      const { getByText } = renderWithTheme(
        <PageTitle>Test Title</PageTitle>
      );
      expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PageTitle>Test Title</PageTitle>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('ContentSection', () => {
    it('should render children content', () => {
      const { getByText } = renderWithTheme(
        <ContentSection>Section Content</ContentSection>
      );
      expect(getByText('Section Content')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <ContentSection>Content</ContentSection>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('PropriedadeCard', () => {
    it('should render card content', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeCard>Card Content</PropriedadeCard>
      );
      expect(getByText('Card Content')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PropriedadeCard>Card</PropriedadeCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('PropriedadeName', () => {
    it('should render property name', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeName>Property Name</PropriedadeName>
      );
      expect(getByText('Property Name')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PropriedadeName>Name</PropriedadeName>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('PropriedadeInfo', () => {
    it('should render property info', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeInfo>Property Info</PropriedadeInfo>
      );
      expect(getByText('Property Info')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PropriedadeInfo>Info</PropriedadeInfo>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle multiple paragraphs', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeInfo>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </PropriedadeInfo>
      );
      expect(getByText('First paragraph')).toBeInTheDocument();
      expect(getByText('Second paragraph')).toBeInTheDocument();
    });
  });

  describe('PropriedadeActions', () => {
    it('should render action buttons', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeActions>
          <button>Edit</button>
          <button>Delete</button>
        </PropriedadeActions>
      );
      expect(getByText('Edit')).toBeInTheDocument();
      expect(getByText('Delete')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <PropriedadeActions>Actions</PropriedadeActions>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render multiple action buttons', () => {
      const { getByText } = renderWithTheme(
        <PropriedadeActions>
          <button>Action 1</button>
          <button>Action 2</button>
          <button>Action 3</button>
        </PropriedadeActions>
      );
      expect(getByText('Action 1')).toBeInTheDocument();
      expect(getByText('Action 2')).toBeInTheDocument();
      expect(getByText('Action 3')).toBeInTheDocument();
    });
  });

  describe('LoadingMessage', () => {
    it('should render loading message', () => {
      const { getByText } = renderWithTheme(
        <LoadingMessage>Loading...</LoadingMessage>
      );
      expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <LoadingMessage>Loading</LoadingMessage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should display custom loading text', () => {
      const { getByText } = renderWithTheme(
        <LoadingMessage>Please wait...</LoadingMessage>
      );
      expect(getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('ErrorMessage', () => {
    it('should render error message', () => {
      const { getByText } = renderWithTheme(
        <ErrorMessage>Error occurred</ErrorMessage>
      );
      expect(getByText('Error occurred')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <ErrorMessage>Error</ErrorMessage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should display custom error text', () => {
      const { getByText } = renderWithTheme(
        <ErrorMessage>Something went wrong</ErrorMessage>
      );
      expect(getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('EmptyMessage', () => {
    it('should render empty state message', () => {
      const { getByText } = renderWithTheme(
        <EmptyMessage>No data available</EmptyMessage>
      );
      expect(getByText('No data available')).toBeInTheDocument();
    });

    it('should render correctly', () => {
      const { container } = renderWithTheme(
        <EmptyMessage>Empty</EmptyMessage>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should display custom empty text', () => {
      const { getByText } = renderWithTheme(
        <EmptyMessage>No properties found</EmptyMessage>
      );
      expect(getByText('No properties found')).toBeInTheDocument();
    });
  });

  describe('Theme integration', () => {
    it('should render with theme provider', () => {
      const { getByText } = renderWithTheme(
        <PageContainer>Theme test</PageContainer>
      );
      expect(getByText('Theme test')).toBeInTheDocument();
    });

    it('should handle multiple styled components', () => {
      const { getByText } = renderWithTheme(
        <PageContainer>
          <PageTitle>Title</PageTitle>
          <ErrorMessage>Error</ErrorMessage>
        </PageContainer>
      );
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Error')).toBeInTheDocument();
    });

    it('should work with nested components', () => {
      const { getByText } = renderWithTheme(
        <PageContainer>
          <PageHeader>
            <PageTitle>Nested Title</PageTitle>
          </PageHeader>
        </PageContainer>
      );
      expect(getByText('Nested Title')).toBeInTheDocument();
    });

    it('should accept theme props correctly', () => {
      const { container } = renderWithTheme(
        <PropriedadeCard>Card with theme</PropriedadeCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render all components within PageContainer', () => {
      const { getByText } = renderWithTheme(
        <PageContainer>
          <PageHeader>Header</PageHeader>
          <PageTitle>Title</PageTitle>
          <ContentSection>
            <PropriedadeCard>
              <PropriedadeName>Property</PropriedadeName>
              <PropriedadeInfo>Info</PropriedadeInfo>
              <PropriedadeActions>Actions</PropriedadeActions>
            </PropriedadeCard>
          </ContentSection>
          <LoadingMessage>Loading</LoadingMessage>
          <ErrorMessage>Error</ErrorMessage>
          <EmptyMessage>Empty</EmptyMessage>
        </PageContainer>
      );

      expect(getByText('Header')).toBeInTheDocument();
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Property')).toBeInTheDocument();
      expect(getByText('Info')).toBeInTheDocument();
      expect(getByText('Actions')).toBeInTheDocument();
      expect(getByText('Loading')).toBeInTheDocument();
      expect(getByText('Error')).toBeInTheDocument();
      expect(getByText('Empty')).toBeInTheDocument();
    });
  });
});
