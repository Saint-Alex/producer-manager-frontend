import { PieChart } from '@mui/x-charts/PieChart';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '../../components/shared';
import { AppDispatch, RootState } from '../../store';
import { fetchPropriedades } from '../../store/propriedadeRuralSlice';
import { fetchSafras } from '../../store/safraSlice';
import { CHART_PALETTES } from '../../utils/chartColors';
import {
  ButtonContainer,
  FeaturesSection,
  FeaturesTitle,
  HomeCard,
  HomeContainer,
  HomeDescription,
  HomeTitle,
} from './HomePage.styled';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { propriedades } = useSelector((state: RootState) => state.propriedades);
  const { safras } = useSelector((state: RootState) => state.safras);

  useEffect(() => {
    dispatch(fetchPropriedades());
    dispatch(fetchSafras());
  }, [dispatch]);

  const getEstadosData = () => {
    const estadosCount = propriedades.reduce(
      (acc, prop) => {
        acc[prop.estado] = (acc[prop.estado] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(estadosCount).map(([estado, count], index) => ({
      id: index,
      value: count,
      label: estado,
    }));
  };

  const getCulturasData = () => {
    const culturasCount = safras.reduce(
      (acc, safra) => {
        if (safra.cultivos) {
          safra.cultivos.forEach(cultivo => {
            const cultura = cultivo.cultura?.nome || /* istanbul ignore next */ 'Não especificada';
            acc[cultura] = (acc[cultura] || 0) + 1;
          });
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(culturasCount)
      .filter(([_, count]) => count > 0)
      .map(([cultura, count], index) => ({
        id: index,
        value: count,
        label: cultura,
      }));
  };

  const getUsoSoloData = () => {
    const totalAgricultavel = propriedades.reduce(
      (total, prop) => total + parseFloat(prop.areaAgricultavel.toString()),
      0
    );
    const totalVegetacao = propriedades.reduce(
      (total, prop) => total + parseFloat(prop.areaVegetacao.toString()),
      0
    );

    return [
      {
        id: 0,
        value: totalAgricultavel,
        label: 'Área Agricultável',
      },
      {
        id: 1,
        value: totalVegetacao,
        label: 'Área de Vegetação',
      },
    ];
  };

  return (
    <HomeContainer>
      <HomeCard>
        <HomeTitle>Dashboard - Gestão Rural</HomeTitle>
        <HomeDescription>
          Visão geral do sistema de gerenciamento de produtores rurais
        </HomeDescription>

        <ButtonContainer>
          <ActionButton variant='primary' onClick={() => navigate('/producers')}>
            Gerenciar Produtores
          </ActionButton>
          <ActionButton variant='secondary' onClick={() => navigate('/culturas')}>
            Gerenciar Culturas
          </ActionButton>
          <ActionButton variant='outlined-primary' onClick={() => navigate('/producer-register')}>
            + Novo Produtor
          </ActionButton>
        </ButtonContainer>

        <FeaturesSection>
          <FeaturesTitle>Estatísticas do Sistema:</FeaturesTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                border: '1px solid #2196f3',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#1976d2',
                }}
              >
                {propriedades.length}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#424242',
                  marginTop: '0.5rem',
                }}
              >
                Total de Fazendas Cadastradas
              </div>
            </div>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#e8f5e8',
                borderRadius: '8px',
                border: '1px solid #4caf50',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#388e3c',
                }}
              >
                {Math.round(
                  propriedades.reduce(
                    (total, prop) => total + parseFloat(prop.areaTotal.toString()),
                    0
                  )
                ).toLocaleString('pt-BR')}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#424242',
                  marginTop: '0.5rem',
                }}
              >
                Total de Hectares Registrados
              </div>
            </div>
          </div>
        </FeaturesSection>

        <FeaturesSection>
          <FeaturesTitle>Análises Gráficas:</FeaturesTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  textAlign: 'center',
                  color: '#333',
                  fontSize: '1.1rem',
                }}
              >
                Distribuição por Estado
              </h4>
              {getEstadosData().length > 0 ? (
                <PieChart
                  colors={CHART_PALETTES.estados}
                  series={[
                    {
                      data: getEstadosData(),
                      arcLabel: item =>
                        item.value > 0 ? `${item.value}` : /* istanbul ignore next */ '',
                      arcLabelMinAngle: 20,
                      arcLabelRadius: '60%',
                    },
                  ]}
                  height={250}
                  slotProps={{
                    pieArcLabel: {
                      style: {
                        fill: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                      },
                    },
                    legend: {
                      direction: 'horizontal',
                      position: { vertical: 'bottom', horizontal: 'center' },
                    },
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                  }}
                >
                  Sem dados para exibir
                </div>
              )}
            </div>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  textAlign: 'center',
                  color: '#333',
                  fontSize: '1.1rem',
                }}
              >
                Culturas Plantadas
              </h4>
              {getCulturasData().length > 0 ? (
                <PieChart
                  colors={CHART_PALETTES.culturas}
                  series={[
                    {
                      data: getCulturasData(),
                      arcLabel: item =>
                        item.value > 0 ? `${item.value}` : /* istanbul ignore next */ '',
                      arcLabelMinAngle: 20,
                      arcLabelRadius: '60%',
                    },
                  ]}
                  height={250}
                  slotProps={{
                    pieArcLabel: {
                      style: {
                        fill: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                      },
                    },
                    legend: {
                      direction: 'horizontal',
                      position: { vertical: 'bottom', horizontal: 'center' },
                    },
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                  }}
                >
                  Sem dados para exibir
                </div>
              )}
            </div>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  textAlign: 'center',
                  color: '#333',
                  fontSize: '1.1rem',
                }}
              >
                Uso do Solo (Hectares)
              </h4>
              {getUsoSoloData().every(item => item.value > 0) ? (
                <PieChart
                  colors={CHART_PALETTES.usoSolo}
                  series={[
                    {
                      data: getUsoSoloData(),
                      arcLabel: item => {
                        if (item.value === 0) return '';
                        return item.value < 1000
                          ? `${item.value.toFixed(1)}`
                          : `${(item.value / 1000).toFixed(1)}k`;
                      },
                      arcLabelMinAngle: 20,
                      arcLabelRadius: '60%',
                    },
                  ]}
                  height={250}
                  slotProps={{
                    pieArcLabel: {
                      style: {
                        fill: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                      },
                    },
                    legend: {
                      direction: 'horizontal',
                      position: { vertical: 'bottom', horizontal: 'center' },
                    },
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                  }}
                >
                  Sem dados para exibir
                </div>
              )}
            </div>
          </div>
        </FeaturesSection>
      </HomeCard>
    </HomeContainer>
  );
};

export default HomePage;
