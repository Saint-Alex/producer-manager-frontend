import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProducerList } from '../../components/lists';
import { ActionButton, ConfirmModal, NotificationModal } from '../../components/shared';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteProducer, fetchProducers } from '../../store/producerSlice';
import {
  ContentSection,
  EmptyMessage,
  ErrorMessage,
  FilterButton,
  HeaderActions,
  LoadingMessage,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
  SectionContent,
  SectionHeader,
  StatCard,
  StatLabel,
  StatNumber,
  StatsContainer
} from './ProducersPage.styled';

const ProducersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { producers, loading, error } = useAppSelector((state) => state.producers);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [producerToDelete, setProducerToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  // Filter producers based on search term (with safety check)
  const producersList = producers || [];
  const filteredProducers = producersList.filter(producer =>
    producer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producer.cpfCnpj.includes(searchTerm)
  );

  // Calculate stats
  const totalProducers = producersList.length;
  const totalPropertiesCount = producersList.reduce((acc, producer) =>
    acc + (producer.propriedades?.length || 0), 0
  );

  const handleNewProducer = () => {
    navigate('/producer-register');
  };

  const handleEditProducer = (id: string) => {
    navigate(`/producer-edit/${id}`);
  };

  const handleViewProperties = (id: string) => {
    navigate(`/propriedades/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setProducerToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (producerToDelete) {
      try {
        await dispatch(deleteProducer(producerToDelete)).unwrap();
        setNotificationMessage('Produtor excluído com sucesso!');
        setNotificationType('success');
        setShowNotification(true);
      } catch (error) {
        setNotificationMessage('Erro ao excluir produtor. Tente novamente.');
        setNotificationType('error');
        setShowNotification(true);
      }
    }
    setShowDeleteModal(false);
    setProducerToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProducerToDelete(null);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Carregando produtores...</LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Produtores Rurais</PageTitle>
        <HeaderActions>
          <ActionButton
            variant="primary"
            size="large"
            onClick={handleNewProducer}
          >
            + Novo Produtor
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatNumber>{totalProducers}</StatNumber>
          <StatLabel>Produtores Cadastrados</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalPropertiesCount}</StatNumber>
          <StatLabel>Propriedades Totais</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{filteredProducers.length}</StatNumber>
          <StatLabel>Resultados da Busca</StatLabel>
        </StatCard>
      </StatsContainer>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por nome ou CPF/CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton onClick={() => setSearchTerm('')}>
          Limpar Filtros
        </FilterButton>
      </SearchContainer>

      <ContentSection>
        <SectionHeader>
          <h2>Lista de Produtores</h2>
          <p>Gerencie os produtores rurais cadastrados no sistema</p>
        </SectionHeader>

        <SectionContent>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {!error && filteredProducers.length === 0 && producers.length === 0 && (
            <EmptyMessage>
              <h3>Nenhum produtor cadastrado</h3>
              <p>Comece cadastrando seu primeiro produtor rural para gerenciar propriedades e culturas.</p>
              <ActionButton variant="primary" onClick={handleNewProducer}>
                Cadastrar Primeiro Produtor
              </ActionButton>
            </EmptyMessage>
          )}

          {!error && filteredProducers.length === 0 && producers.length > 0 && (
            <EmptyMessage>
              <h3>Nenhum resultado encontrado</h3>
              <p>Tente ajustar os termos de busca ou limpar os filtros.</p>
            </EmptyMessage>
          )}

          {!error && filteredProducers.length > 0 && (
            <ProducerList
              producers={filteredProducers}
              onEdit={handleEditProducer}
              onDelete={handleDeleteClick}
              onViewProperties={handleViewProperties}
            />
          )}
        </SectionContent>
      </ContentSection>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita e todas as propriedades associadas também serão removidas."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <NotificationModal
        isOpen={showNotification}
        title={notificationType === 'success' ? 'Sucesso!' : 'Erro!'}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </PageContainer>
  );
};

export default ProducersPage;
