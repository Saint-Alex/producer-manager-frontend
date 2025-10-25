import { createSafra, deleteSafra, fetchSafrasByPropriedade, updateSafra } from '@/store/safraSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButton, NotificationModal } from '../../components/shared';
import { CULTURAS_COMUNS, ESTADOS_BRASILEIROS } from '../../constants';
import { AppDispatch, RootState } from '../../store';
import { createPropriedade, fetchPropriedadeById, updatePropriedade } from '../../store/propriedadeRuralSlice';
import { PropriedadeRuralFormData } from '../../types/propriedadeRural';
import { Safra, SafraFormData } from '../../types/safra';
import {
  BackButton,
  ButtonGroup,
  FormContainer,
  FormGroup,
  FormSection,
  Input,
  Label,
  PageContainer,
  PageHeader,
  PageTitle,
  SectionTitle
} from './FazendaForm.styled';

const FazendaForm: React.FC = () => {
  const { produtorId, propriedadeId } = useParams<{ produtorId: string; propriedadeId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentPropriedade, loading: propriedadeLoading } = useSelector((state: RootState) => state.propriedades);
  const { safras, loading: safrasLoading } = useSelector((state: RootState) => state.safras);

  const [fazendaData, setFazendaData] = useState<PropriedadeRuralFormData>({
    nomeFazenda: '',
    cidade: '',
    estado: '',
    areaTotal: '',
    areaAgricultavel: '',
    areaVegetacao: ''
  });

  const [safraData, setSafraData] = useState<SafraFormData>({
    ano: '',
    nome: '',
    culturasPlantadas: []
  });

  const [isAddingSafra, setIsAddingSafra] = useState(false);
  const [editingSafraId, setEditingSafraId] = useState<string | null>(null);

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

  const isEditing = !!propriedadeId;

  useEffect(() => {
    if (isEditing && propriedadeId) {
      dispatch(fetchPropriedadeById(propriedadeId));
      dispatch(fetchSafrasByPropriedade(propriedadeId));
    }
  }, [dispatch, isEditing, propriedadeId]);

  useEffect(() => {
    if (currentPropriedade && isEditing) {
      setFazendaData({
        nomeFazenda: currentPropriedade.nomeFazenda,
        cidade: currentPropriedade.cidade,
        estado: currentPropriedade.estado,
        areaTotal: String(currentPropriedade.areaTotal),
        areaAgricultavel: String(currentPropriedade.areaAgricultavel),
        areaVegetacao: String(currentPropriedade.areaVegetacao)
      });
    }
  }, [currentPropriedade, isEditing]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFazendaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFazenda = (): boolean => {
    if (!fazendaData.nomeFazenda?.trim()) {
      showNotification('error', 'Erro de Validação', 'Nome da fazenda é obrigatório');
      return false;
    }

    if (!fazendaData.cidade?.trim()) {
      showNotification('error', 'Erro de Validação', 'Cidade é obrigatória');
      return false;
    }

    if (!fazendaData.estado?.trim()) {
      showNotification('error', 'Erro de Validação', 'Estado é obrigatório');
      return false;
    }

    const areaTotal = parseFloat(fazendaData.areaTotal) || 0;
    if (areaTotal <= 0) {
      showNotification('error', 'Erro de Validação', 'Área total deve ser maior que zero');
      return false;
    }

    const areaAgricultavel = parseFloat(fazendaData.areaAgricultavel) || 0;
    const areaVegetacao = parseFloat(fazendaData.areaVegetacao) || 0;

    if (areaAgricultavel + areaVegetacao > areaTotal) {
      showNotification('error', 'Erro de Validação', 'A soma da área agricultável e vegetação não pode ser maior que a área total');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFazenda()) return;

    try {
      if (isEditing && propriedadeId) {
        await dispatch(updatePropriedade({
          id: propriedadeId,
          data: fazendaData
        })).unwrap();

        showNotification('success', 'Fazenda Atualizada', 'Fazenda foi atualizada com sucesso!');
      } else {
        await dispatch(createPropriedade({
          ...fazendaData,
          produtorId: produtorId!
        })).unwrap();

        if (produtorId) {
          navigate(`/propriedades/${produtorId}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar fazenda:', error);
      showNotification('error', 'Erro ao Salvar', 'Erro ao salvar a fazenda. Tente novamente.');
    }
  };

  const handleCancel = () => {
    if (produtorId) {
      navigate(`/propriedades/${produtorId}`);
    } else {
      navigate('/');
    }
  };

  const handleAddSafra = () => {
    setIsAddingSafra(true);
    setSafraData({ ano: '', nome: '', culturasPlantadas: [] });
    setEditingSafraId(null);
  };

  const handleEditSafra = (safra: Safra) => {
    setIsAddingSafra(true);
    setSafraData({
      ano: safra.ano.toString(),
      nome: safra.nome,
      culturasPlantadas: safra.cultivos?.map(c => c.cultura?.nome || '') || []
    });
    setEditingSafraId(safra.id);
  };

  const handleSafraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSafraData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCultura = (cultura: string) => {
    if (cultura && !safraData.culturasPlantadas.includes(cultura)) {
      setSafraData(prev => ({
        ...prev,
        culturasPlantadas: [...prev.culturasPlantadas, cultura]
      }));
    }
  };

  const handleRemoveCultura = (cultura: string) => {
    setSafraData(prev => ({
      ...prev,
      culturasPlantadas: prev.culturasPlantadas.filter(c => c !== cultura)
    }));
  };

  const handleSaveSafra = async () => {
    if (!propriedadeId && !isEditing) {
      showNotification('error', 'Erro', 'Salve a fazenda primeiro antes de adicionar safras.');
      return;
    }

    if (!safraData.ano || !safraData.nome || safraData.culturasPlantadas.length === 0) {
      showNotification('error', 'Erro', 'Preencha todos os campos da safra e adicione pelo menos uma cultura.');
      return;
    }

    try {
      const safraDataToSave = {
        nome: safraData.nome,
        ano: parseInt(safraData.ano),
      };

      if (editingSafraId) {
        await dispatch(updateSafra({
          id: editingSafraId,
          data: safraDataToSave
        })).unwrap();
        showNotification('success', 'Safra Atualizada', 'Safra foi atualizada com sucesso!');
      } else {
        await dispatch(createSafra(safraDataToSave)).unwrap();
        showNotification('success', 'Safra Adicionada', 'Safra foi adicionada com sucesso!');
      }

      setIsAddingSafra(false);
      setSafraData({ ano: '', nome: '', culturasPlantadas: [] });
      setEditingSafraId(null);
    } catch (error) {
      console.error('Erro ao salvar safra:', error);
      showNotification('error', 'Erro ao Salvar', 'Erro ao salvar a safra. Tente novamente.');
    }
  };

  const handleDeleteSafra = async (safraId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta safra?')) {
      return;
    }

    try {
      await dispatch(deleteSafra(safraId)).unwrap();
      showNotification('success', 'Safra Removida', 'Safra foi removida com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar safra:', error);
      showNotification('error', 'Erro ao Deletar', 'Erro ao deletar a safra. Tente novamente.');
    }
  };

  const handleCancelSafra = () => {
    setIsAddingSafra(false);
    setSafraData({ ano: '', nome: '', culturasPlantadas: [] });
    setEditingSafraId(null);
  };

  return (
    <>
      <PageContainer>
        <PageHeader>
          <BackButton onClick={handleCancel}>
            ← Voltar
          </BackButton>
          <PageTitle>
            {isEditing ? 'Editar Fazenda' : 'Cadastrar Nova Fazenda'}
          </PageTitle>
        </PageHeader>

        <FormContainer>
          <FormSection>
            <SectionTitle>Dados da Fazenda</SectionTitle>

            <FormGroup>
              <Label htmlFor="nomeFazenda">Nome da Fazenda *</Label>
              <Input
                id="nomeFazenda"
                name="nomeFazenda"
                type="text"
                value={fazendaData.nomeFazenda || ''}
                onChange={handleInputChange}
                placeholder="Ex: Fazenda Santa Maria"
                required
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={fazendaData.cidade || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Sorriso"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="estado">Estado *</Label>
                <select
                  id="estado"
                  name="estado"
                  value={fazendaData.estado || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BRASILEIROS.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label htmlFor="areaTotal">Área Total (ha) *</Label>
                <Input
                  id="areaTotal"
                  name="areaTotal"
                  type="number"
                  value={fazendaData.areaTotal || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="areaAgricultavel">Área Agricultável (ha)</Label>
                <Input
                  id="areaAgricultavel"
                  name="areaAgricultavel"
                  type="number"
                  value={fazendaData.areaAgricultavel || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="areaVegetacao">Área de Vegetação (ha)</Label>
                <Input
                  id="areaVegetacao"
                  name="areaVegetacao"
                  type="number"
                  value={fazendaData.areaVegetacao || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </FormGroup>
            </div>
          </FormSection>

          {isEditing && (
            <FormSection>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <SectionTitle>Safras da Fazenda</SectionTitle>
                <ActionButton
                  variant="outlined-primary"
                  onClick={handleAddSafra}
                  disabled={safrasLoading}
                >
                  + Adicionar Safra
                </ActionButton>
              </div>

              {isAddingSafra && (
                <div style={{
                  padding: '1.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0, color: '#495057' }}>
                      {editingSafraId ? 'Editar Safra' : 'Adicionar Nova Safra'}
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <FormGroup style={{ margin: 0 }}>
                      <Label htmlFor="safraAno">Ano *</Label>
                      <Input
                        id="safraAno"
                        name="ano"
                        type="number"
                        value={safraData.ano}
                        onChange={handleSafraInputChange}
                        placeholder="2024"
                        min="2000"
                        max="2030"
                        required
                      />
                    </FormGroup>
                    <FormGroup style={{ margin: 0 }}>
                      <Label htmlFor="safraNome">Nome da Safra *</Label>
                      <Input
                        id="safraNome"
                        name="nome"
                        type="text"
                        value={safraData.nome}
                        onChange={handleSafraInputChange}
                        placeholder="Ex: Safra Verão 2024"
                        required
                      />
                    </FormGroup>
                  </div>

                  <FormGroup style={{ margin: '0 0 1.5rem 0' }}>
                    <Label>Culturas Plantadas *</Label>

                    <div style={{ marginBottom: '1rem' }}>
                      <select
                        aria-label="Selecione uma cultura"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const cultura = e.target.value;
                          if (cultura) {
                            handleAddCultura(cultura);
                            e.target.value = '';
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Selecione uma cultura para adicionar</option>
                        {CULTURAS_COMUNS
                          .filter(cultura => !safraData.culturasPlantadas.includes(cultura))
                          .map((cultura) => (
                            <option key={cultura} value={cultura}>
                              {cultura}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {safraData.culturasPlantadas.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {safraData.culturasPlantadas.map((cultura) => (
                          <div
                            key={cultura}
                            style={{
                              backgroundColor: '#198754',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            {cultura}
                            <button
                              type="button"
                              onClick={() => handleRemoveCultura(cultura)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                lineHeight: '1',
                                padding: '0',
                                marginLeft: '0.25rem'
                              }}
                              title={`Remover ${cultura}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        fontStyle: 'italic',
                        margin: '0.5rem 0 1rem 0'
                      }}>
                        Nenhuma cultura selecionada
                      </p>
                    )}
                  </FormGroup>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <ActionButton
                      variant="secondary"
                      onClick={handleCancelSafra}
                      disabled={safrasLoading}
                    >
                      Cancelar
                    </ActionButton>
                    <ActionButton
                      variant="primary"
                      onClick={handleSaveSafra}
                      disabled={safrasLoading}
                    >
                      {safrasLoading ? 'Salvando...' : (editingSafraId ? 'Atualizar' : 'Adicionar')}
                    </ActionButton>
                  </div>
                </div>
              )}

              <div>
                {safrasLoading ? (
                  <p>Carregando safras...</p>
                ) : (!safras || safras.length === 0) ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Nenhuma safra cadastrada para esta fazenda.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {(safras || []).map((safra) => (
                      <div
                        key={safra.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          backgroundColor: 'white'
                        }}
                      >
                        <div>
                          <strong>{safra.nome}</strong> - Ano: {safra.ano}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton
                            variant="outlined-secondary"
                            onClick={() => handleEditSafra(safra)}
                            disabled={safrasLoading || isAddingSafra}
                            size="small"
                          >
                            Editar
                          </ActionButton>
                          <ActionButton
                            variant="outlined-danger"
                            onClick={() => handleDeleteSafra(safra.id)}
                            disabled={safrasLoading || isAddingSafra}
                            size="small"
                          >
                            Excluir
                          </ActionButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormSection>
          )}

          <FormSection>
            <ButtonGroup>
              <ActionButton
                variant="outlined-secondary"
                onClick={handleCancel}
                disabled={propriedadeLoading}
              >
                Cancelar
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={handleSave}
                loading={propriedadeLoading}
              >
                {isEditing ? 'Atualizar Fazenda' : 'Salvar Fazenda'}
              </ActionButton>
            </ButtonGroup>
          </FormSection>
        </FormContainer>
      </PageContainer>

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

export default FazendaForm;
