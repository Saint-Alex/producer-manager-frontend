import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButton, ConfirmModal, NotificationModal } from '../../components/shared';
import { AppDispatch, RootState } from '../../store';
import { fetchProducers } from '../../store/producerSlice';
import { deletePropriedade, fetchPropriedadesByProdutor } from '../../store/propriedadeRuralSlice';
import { fetchSafrasByPropriedade } from '../../store/safraSlice';

const PropriedadesPage: React.FC = () => {
  const { produtorId } = useParams<{ produtorId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { producers } = useSelector((state: RootState) => state.producers);
  const { propriedades, loading, error } = useSelector((state: RootState) => state.propriedades);
  const { safras, loading: safrasLoading } = useSelector((state: RootState) => state.safras);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    propriedadeId: string;
    propriedadeName: string;
  }>({
    isOpen: false,
    propriedadeId: '',
    propriedadeName: '',
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const currentProducer = producers.find(p => p.id === produtorId);

  useEffect(() => {
    if (produtorId) {
      dispatch(fetchPropriedadesByProdutor(produtorId));
      if (!currentProducer) {
        dispatch(fetchProducers());
      }
    }
  }, [dispatch, produtorId, currentProducer]);

  useEffect(() => {
    if (propriedades.length > 0) {
      propriedades.forEach(propriedade => {
        dispatch(fetchSafrasByPropriedade(propriedade.id));
      });
    }
  }, [dispatch, propriedades]);

  const showNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const handleDeletePropriedade = (id: string, nomeFazenda: string) => {
    setConfirmModal({
      isOpen: true,
      propriedadeId: id,
      propriedadeName: nomeFazenda,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePropriedade(confirmModal.propriedadeId)).unwrap();
      showNotification(
        'success',
        'Fazenda Removida',
        `Fazenda <strong>"${confirmModal.propriedadeName}"</strong> foi removida com sucesso!`
      );
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      showNotification(
        'error',
        'Erro ao Deletar',
        `Erro ao deletar a fazenda <strong>"${confirmModal.propriedadeName}"</strong>. Tente novamente.`
      );
    } finally {
      setConfirmModal({ isOpen: false, propriedadeId: '', propriedadeName: '' });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, propriedadeId: '', propriedadeName: '' });
  };

  const handleEditPropriedade = (id: string) => {
    navigate(`/fazenda-edit/${produtorId}/${id}`);
  };

  const getPropriedadeSafras = (propriedadeId: string) => {
    return safras.filter(safra =>
      safra.cultivos?.some(cultivo => cultivo.propriedadeRural?.id === propriedadeId)
    );
  };

  const renderPropriedades = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Carregando propriedades...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#dc3545' }}>
          Erro ao carregar propriedades: {error}
        </div>
      );
    }

    if (propriedades.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhuma fazenda cadastrada para este produtor ainda.
        </div>
      );
    }

    return (
      <>
        {propriedades.map(propriedade => {
          const propriedadeSafras = getPropriedadeSafras(propriedade.id);

          return (
            <div
              key={propriedade.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>{propriedade.nomeFazenda}</h3>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Localização:</strong> {propriedade.cidade} - {propriedade.estado}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Área Total:</strong> {propriedade.areaTotal} ha
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Área Agricultável:</strong> {propriedade.areaAgricultavel} ha
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Área de Vegetação:</strong> {propriedade.areaVegetacao} ha
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Cadastrada em:</strong>{' '}
                  {new Date(propriedade.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <ActionButton
                  variant='secondary'
                  onClick={() => handleEditPropriedade(propriedade.id)}
                  disabled={loading}
                >
                  Editar
                </ActionButton>
                <ActionButton
                  variant='outlined-danger'
                  onClick={() => handleDeletePropriedade(propriedade.id, propriedade.nomeFazenda)}
                  disabled={loading}
                >
                  Deletar
                </ActionButton>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <h4 style={{ margin: 0, color: '#495057' }}>
                    Safras da Fazenda{' '}
                    {propriedadeSafras.length > 0 && `(${propriedadeSafras.length})`}
                  </h4>
                  <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                    Para editar safras, clique em &quot;Editar&quot; acima
                  </span>
                </div>

                {safrasLoading ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>Carregando safras...</p>
                ) : propriedadeSafras.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Nenhuma safra cadastrada para esta fazenda.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {propriedadeSafras.map(safra => (
                      <div
                        key={safra.id}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                        }}
                      >
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#495057' }}>{safra.nome}</strong>
                          <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                            - Ano: {safra.ano}
                          </span>
                        </div>

                        {safra.cultivos && safra.cultivos.length > 0 ? (
                          <div>
                            <span
                              style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                marginBottom: '0.5rem',
                                display: 'block',
                              }}
                            >
                              Culturas:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {safra.cultivos.map((cultivo, index) => (
                                <span
                                  key={index}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: '#e8f5e8',
                                    border: '1px solid #4caf50',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    color: '#2e7d32',
                                  }}
                                >
                                  {cultivo.cultura?.nome || 'Não especificada'}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>
                            Nenhuma cultura cadastrada
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              cursor: 'pointer',
              fontSize: '1rem',
              textDecoration: 'underline',
            }}
          >
            ← Voltar
          </button>
          <h1 style={{ margin: 0, color: '#495057' }}>
            Fazendas de {currentProducer?.nome || 'Carregando...'}
          </h1>
          <ActionButton
            variant='primary'
            onClick={() => navigate(`/fazenda-register/${produtorId}`)}
          >
            Cadastrar Nova Fazenda
          </ActionButton>
        </div>

        <div>{renderPropriedades()}</div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title='Confirmar Exclusão'
        message={`<strong>ATENÇÃO:</strong> Tem certeza que deseja deletar a fazenda <strong>"${confirmModal.propriedadeName}"</strong>?

Esta ação não pode ser desfeita e todas as safras associadas também serão removidas.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </>
  );
};

export default PropriedadesPage;
