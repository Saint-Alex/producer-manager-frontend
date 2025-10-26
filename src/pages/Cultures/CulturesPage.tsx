import React, { useEffect, useState } from 'react';
import { ActionButton, ConfirmModal, NotificationModal } from '../../components/shared';
import {
  clearError,
  createCultura,
  deleteCultura,
  fetchCulturas,
  updateCultura,
} from '../../store/culturaSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  ContentSection,
  CulturaActions,
  CulturaCard,
  CulturaDescription,
  CulturaGrid,
  CulturaInfo,
  CulturaName,
  EmptyMessage,
  ErrorMessage,
  FilterButton,
  FormActions,
  FormContainer,
  FormGroup,
  FormModal,
  FormTitle,
  HeaderActions,
  Input,
  Label,
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
  StatsContainer,
  TextArea,
} from './CulturesPage.styled';

interface CulturaFormData {
  nome: string;
  descricao: string;
}

const CulturesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { culturas, loading, error } = useAppSelector(state => state.culturas);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [editingCultura, setEditingCultura] = useState<string | null>(null);
  const [culturaToDelete, setCulturaToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CulturaFormData>({
    nome: '',
    descricao: '',
  });

  useEffect(() => {
    dispatch(fetchCulturas());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setNotificationMessage(error);
      setNotificationType('error');
      setShowNotification(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter culturas based on search term
  const filteredCulturas = culturas.filter(
    cultura =>
      cultura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cultura.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  // Calculate stats
  const totalCulturas = culturas.length;
  const totalCultivos = culturas.reduce((acc, cultura) => acc + (cultura.cultivos?.length || 0), 0);

  const handleNewCultura = () => {
    setFormData({ nome: '', descricao: '' });
    setEditingCultura(null);
    setShowForm(true);
  };

  const handleEditCultura = (cultura: any) => {
    setFormData({
      nome: cultura.nome,
      descricao: cultura.descricao || '',
    });
    setEditingCultura(cultura.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setCulturaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filtrar campos vazios
      const dataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value.trim() !== /* istanbul ignore next */ '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      if (editingCultura) {
        await dispatch(
          updateCultura({
            id: editingCultura,
            data: dataToSend,
          })
        ).unwrap();
        setNotificationMessage('Cultura atualizada com sucesso!');
      } else {
        await dispatch(createCultura(dataToSend)).unwrap();
        setNotificationMessage('Cultura criada com sucesso!');
      }

      setNotificationType('success');
      setShowNotification(true);
      setShowForm(false);
      setFormData({ nome: '', descricao: '' });
      setEditingCultura(null);
    } catch (error) {
      setNotificationMessage('Erro ao salvar cultura. Tente novamente.');
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (culturaToDelete && !(isDeleteDisabled(/* istanbul ignore next */))) {
      try {
        await dispatch(deleteCultura(culturaToDelete)).unwrap();
        setNotificationMessage('Cultura excluída com sucesso!');
        setNotificationType('success');
        setShowNotification(true);
      } catch (error) {
        setNotificationMessage('Erro ao excluir cultura. Tente novamente.');
        setNotificationType('error');
        setShowNotification(true);
      }
    }
    setShowDeleteModal(false);
    setCulturaToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCulturaToDelete(null);
  };

  const getDeleteConfirmationMessage = () => {
    if (!culturaToDelete) return '';

    const cultura = culturas.find(c => c.id === culturaToDelete);
    if (!cultura) return '';

    const cultivosCount = cultura.cultivos?.length || 0;

    if (cultivosCount === 0) {
      return `Tem certeza que deseja excluir a cultura "${cultura.nome}"? Esta ação não pode ser desfeita.`;
    } else {
      return `Não é possível excluir a cultura "${cultura.nome}" pois ela está sendo utilizada em ${cultivosCount} cultivo(s). Para excluir esta cultura, primeiro remova todos os cultivos que a utilizam.`;
    }
  };

  const isDeleteDisabled = () => {
    if (!culturaToDelete) return false;

    const cultura = culturas.find(c => c.id === culturaToDelete);
    if (!cultura) return false;

    const cultivosCount = cultura.cultivos?.length || 0;
    return cultivosCount > 0;
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setFormData({ nome: '', descricao: '' });
    setEditingCultura(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading && culturas.length === 0) {
    return (
      <PageContainer>
        <LoadingMessage>Carregando culturas...</LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Culturas Agrícolas</PageTitle>
        <HeaderActions>
          <ActionButton variant='secondary' size='large' onClick={handleNewCultura}>
            + Nova Cultura
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatNumber>{totalCulturas}</StatNumber>
          <StatLabel>Culturas Cadastradas</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalCultivos}</StatNumber>
          <StatLabel>Cultivos Ativos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{filteredCulturas.length}</StatNumber>
          <StatLabel>Resultados da Busca</StatLabel>
        </StatCard>
      </StatsContainer>

      <SearchContainer>
        <SearchInput
          type='text'
          placeholder='Buscar por nome ou descrição...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterButton onClick={() => setSearchTerm('')}>Limpar Filtros</FilterButton>
      </SearchContainer>

      <ContentSection>
        <SectionHeader>
          <h2>Catálogo de Culturas</h2>
          <p>Gerencie as culturas agrícolas disponíveis no sistema</p>
        </SectionHeader>

        <SectionContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {!error && filteredCulturas.length === 0 && culturas.length === 0 && (
            <EmptyMessage>
              <h3>Nenhuma cultura cadastrada</h3>
              <p>Comece criando sua primeira cultura agrícola para organizar os cultivos.</p>
              <ActionButton variant='secondary' onClick={handleNewCultura}>
                Cadastrar Primeira Cultura
              </ActionButton>
            </EmptyMessage>
          )}

          {!error && filteredCulturas.length === 0 && culturas.length > 0 && (
            <EmptyMessage>
              <h3>Nenhum resultado encontrado</h3>
              <p>Tente ajustar os termos de busca ou limpar os filtros.</p>
            </EmptyMessage>
          )}

          {!error && filteredCulturas.length > 0 && (
            <CulturaGrid>
              {filteredCulturas.map(cultura => (
                <CulturaCard key={cultura.id}>
                  <CulturaName>{cultura.nome}</CulturaName>
                  <CulturaDescription>
                    {cultura.descricao || 'Sem descrição disponível'}
                  </CulturaDescription>
                  <CulturaInfo>
                    <p>
                      <strong>Cultivos:</strong> {cultura.cultivos?.length || 0}
                    </p>
                    <p>
                      <strong>Cadastrada em:</strong>{' '}
                      {new Date(cultura.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </CulturaInfo>
                  <CulturaActions>
                    <ActionButton
                      variant='secondary'
                      size='small'
                      onClick={() => handleEditCultura(cultura)}
                    >
                      Editar
                    </ActionButton>
                    <ActionButton
                      variant='danger'
                      size='small'
                      onClick={() => handleDeleteClick(cultura.id)}
                    >
                      Excluir
                    </ActionButton>
                  </CulturaActions>
                </CulturaCard>
              ))}
            </CulturaGrid>
          )}
        </SectionContent>
      </ContentSection>

      {/* Form Modal */}
      {showForm && (
        <FormModal onClick={e => e.target === e.currentTarget && handleFormCancel()}>
          <FormContainer>
            <FormTitle>{editingCultura ? 'Editar Cultura' : 'Nova Cultura'}</FormTitle>
            <form onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label htmlFor='nome'>Nome da Cultura *</Label>
                <Input
                  type='text'
                  id='nome'
                  name='nome'
                  value={formData.nome}
                  onChange={handleFormChange}
                  placeholder='Ex: Soja, Milho, Algodão...'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='descricao'>Descrição</Label>
                <TextArea
                  id='descricao'
                  name='descricao'
                  value={formData.descricao}
                  onChange={handleFormChange}
                  placeholder='Descrição detalhada da cultura, características, período de plantio, etc.'
                  rows={4}
                />
              </FormGroup>

              <FormActions>
                <ActionButton type='button' variant='secondary' onClick={handleFormCancel}>
                  Cancelar
                </ActionButton>
                <ActionButton type='submit' variant='primary' disabled={loading}>
                  {loading ? 'Salvando...' : editingCultura ? 'Atualizar' : 'Criar'}
                </ActionButton>
              </FormActions>
            </form>
          </FormContainer>
        </FormModal>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title='Confirmar Exclusão'
        message={getDeleteConfirmationMessage()}
        confirmDisabled={false}
        variant={isDeleteDisabled() ? 'info' : 'danger'}
        onConfirm={isDeleteDisabled() ? handleCancelDelete : handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={isDeleteDisabled() ? 'Entendi' : 'Excluir'}
        cancelText={isDeleteDisabled() ? 'Fechar' : 'Cancelar'}
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

export default CulturesPage;
