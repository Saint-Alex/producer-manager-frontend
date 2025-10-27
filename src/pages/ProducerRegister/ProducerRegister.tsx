import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ProducerForm } from '../../components/forms/ProducerForm';
import { AppDispatch, RootState } from '../../store';
import {
  clearCurrentProducer,
  createProducer,
  fetchProducerById,
  updateProducer,
} from '../../store/producerSlice';
import { createPropriedade } from '../../store/propriedadeRuralSlice';
import { createSafra } from '../../store/safraSlice';
import { Producer, ProducerFormData } from '../../types/producer';
import { PageContainer as Container, ErrorMessage, PageTitle } from './ProducerRegister.styled';

const ProducerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { currentProducer, loading } = useSelector((state: RootState) => state.producers);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchProducerById(id));
    }

    return () => {
      dispatch(clearCurrentProducer());
    };
  }, [dispatch, id, isEditMode]);

  const convertProducerToFormData = (producer: Producer): ProducerFormData => {
    return {
      cpfCnpj: producer.cpfCnpj,
      nome: producer.nome,
      fazendas: [],
    };
  };

  const handleSubmit = async (formData: ProducerFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isEditMode && id) {
        await dispatch(
          updateProducer({
            id,
            data: {
              cpfCnpj: formData.cpfCnpj,
              nome: formData.nome,
            },
          })
        ).unwrap();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const producerResult = await dispatch(
          createProducer({
            cpfCnpj: formData.cpfCnpj,
            nome: formData.nome,
          })
        ).unwrap();

        const produtorId = producerResult.id;

        for (const fazenda of formData.fazendas) {
          try {
            // Validar dados da fazenda antes de enviar
            if (
              !fazenda.nomeFazenda?.trim() ||
              !fazenda.cidade?.trim() ||
              !fazenda.estado?.trim()
            ) {
              console.error('Dados da fazenda incompletos:', fazenda);
              continue; // Pula fazenda com dados incompletos
            }

            const propriedadeResult = await dispatch(
              createPropriedade({
                produtorId,
                nomeFazenda: fazenda.nomeFazenda,
                cidade: fazenda.cidade,
                estado: fazenda.estado,
                areaTotal: fazenda.areaTotal?.toString() || '0',
                areaAgricultavel: fazenda.areaAgricultavel?.toString() || '0',
                areaVegetacao: fazenda.areaVegetacao?.toString() || '0',
              })
            ).unwrap();

            const propriedadeId = propriedadeResult.id;

            for (const safra of fazenda.safras) {
              if (safra.ano && safra.nome && safra.culturasPlantadas.length > 0) {
                await dispatch(
                  createSafra({
                    nome: safra.nome,
                    ano: Number(safra.ano),
                    propriedadeRuralId: propriedadeId,
                  })
                ).unwrap();
              }
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Erro ao criar fazenda:', fazenda.nomeFazenda, error);
            // Não interromper o processo se uma fazenda falhar
          }
        }
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Erro no cadastro:', error);
      setErrorMessage(
        isEditMode
          ? 'Erro ao atualizar o produtor. Tente novamente.'
          : 'Erro ao cadastrar o produtor. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container>
      <PageTitle>{isEditMode ? 'Editar Produtor' : 'Cadastrar Novo Produtor'}</PageTitle>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <ProducerForm
        initialData={currentProducer ? convertProducerToFormData(currentProducer) : undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading || loading}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default ProducerRegisterPage;
