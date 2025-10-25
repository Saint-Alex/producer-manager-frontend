import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 90px 0 20px; /* 70px header height + 20px spacing */

  @media (max-width: 768px) {
    padding: 80px 0 20px; /* 60px header height + 20px spacing */
  }
`;

export const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin: 20px auto;
  max-width: 800px;
  text-align: center;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin: 20px auto;
  max-width: 800px;
  text-align: center;
  font-weight: 500;
`;

export const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin: 20px 0 30px;
  font-weight: 600;
`;
