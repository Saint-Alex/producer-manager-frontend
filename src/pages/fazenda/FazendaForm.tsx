import {
  createSafra,
  deleteSafra,
  fetchSafrasByPropriedade,
  updateSafra,
} from '@/store/safraSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButton, NotificationModal } from '../../components/shared';
import { ESTADOS_BRASILEIROS } from '../../constants';
import { cultivoService } from '../../services/cultivoService';
import { culturaService } from '../../services/culturaService';
import { AppDispatch, RootState } from '../../store';
import {
  createPropriedade,
  fetchPropriedadeById,
  updatePropriedade,
} from '../../store/propriedadeRuralSlice';
import { Cultura } from '../../types/cultura';
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
  SectionTitle,
} from './FazendaForm.styled';

const FazendaForm: React.FC = () => {
  const { produtorId, propriedadeId } = useParams<{ produtorId: string; propriedadeId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentPropriedade, loading: propriedadeLoading } = useSelector(
    (state: RootState) => state.propriedades
  );
  const {
    safras,
    loading: safrasLoading,
    safrasByPropriedade,
  } = useSelector((state: RootState) => state.safras);

  // Filtrar safras da propriedade específica (relacionamento 1:N)
  // Preferir o cache por propriedade quando disponível (safrasByPropriedade),
  // caso contrário filtrar o array global de safras.
  const safrasPropriedade =
    (propriedadeId && safrasByPropriedade?.[propriedadeId]) ||
    (safras || /* istanbul ignore next */ []).filter(
      safra =>
        safra.propriedadeRural?.id === propriedadeId ||
        /* istanbul ignore next */
        safra.propriedadeRural?.id === currentPropriedade?.id
    );

  const [fazendaData, setFazendaData] = useState<PropriedadeRuralFormData>({
    nomeFazenda: '',
    cidade: '',
    estado: '',
    areaTotal: '',
    areaAgricultavel: '',
    areaVegetacao: '',
  });

  const [safraData, setSafraData] = useState<SafraFormData>({
    ano: '',
    nome: '',
    propriedadeRuralId: '',
    culturasPlantadas: [],
  });

  const [culturasDisponiveis, setCulturasDisponiveis] = useState<Cultura[]>([]);
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
    const loadCulturas = async () => {
      try {
        const culturas = await culturaService.getAll();
        setCulturasDisponiveis(culturas);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar culturas:', error);
        showNotification('error', 'Erro', 'Erro ao carregar culturas disponíveis.');
      }
    };

    loadCulturas();
  }, []);

  useEffect(() => {
    if (isEditing && propriedadeId) {
      dispatch(fetchPropriedadeById(propriedadeId));
      // Buscar apenas as safras da propriedade em edição para evitar sobrescrever
      // o estado global com uma chamada que retorna todas as safras.
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
        areaVegetacao: String(currentPropriedade.areaVegetacao),
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
      [name]: value,
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

    const areaTotal = parseFloat(fazendaData.areaTotal) || /* istanbul ignore next */ 0;
    if (areaTotal <= 0) {
      showNotification('error', 'Erro de Validação', 'Área total deve ser maior que zero');
      return false;
    }

    const areaAgricultavel =
      parseFloat(fazendaData.areaAgricultavel) || /* istanbul ignore next */ 0;
    const areaVegetacao = parseFloat(fazendaData.areaVegetacao) || /* istanbul ignore next */ 0;

    if (areaAgricultavel + areaVegetacao > areaTotal) {
      showNotification(
        'error',
        'Erro de Validação',
        'A soma da área agricultável e vegetação não pode ser maior que a área total'
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFazenda()) return;

    try {
      if (isEditing && propriedadeId) {
        await dispatch(
          updatePropriedade({
            id: propriedadeId,
            data: fazendaData,
          })
        ).unwrap();

        showNotification('success', 'Fazenda Atualizada', 'Fazenda foi atualizada com sucesso!');
      } else {
        await dispatch(
          createPropriedade({
            ...fazendaData,
            produtorId: produtorId!,
          })
        ).unwrap();

        if (produtorId) {
          navigate(`/propriedades/${produtorId}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
    setSafraData({
      ano: '',
      nome: '',
      propriedadeRuralId: propriedadeId || currentPropriedade?.id || '',
      culturasPlantadas: [],
    });
    setEditingSafraId(null);
  };

  const handleEditSafra = (safra: Safra) => {
    setIsAddingSafra(true);
    setSafraData({
      ano: safra.ano.toString(),
      nome: safra.nome,
      propriedadeRuralId:
        safra.propriedadeRural?.id || propriedadeId || currentPropriedade?.id || '',
      culturasPlantadas:
        safra.cultivos?.map(c => ({
          culturaId: c.cultura?.id || '',
          culturaNome: c.cultura?.nome || '',
          areaPlantada: Number(c.areaPlantada) || 0,
        })) || /* istanbul ignore next */ [],
    });
    setEditingSafraId(safra.id);
  };

  const handleSafraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSafraData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCultura = (culturaId: string) => {
    const cultura = culturasDisponiveis.find(c => c.id === culturaId);
    if (cultura && !safraData.culturasPlantadas.some(c => c.culturaId === culturaId)) {
      setSafraData(prev => ({
        ...prev,
        culturasPlantadas: [
          ...prev.culturasPlantadas,
          {
            culturaId: cultura.id,
            culturaNome: cultura.nome,
            areaPlantada: 0,
          },
        ],
      }));
    }
  };

  const handleRemoveCultura = (culturaId: string) => {
    setSafraData(prev => ({
      ...prev,
      culturasPlantadas: prev.culturasPlantadas.filter(c => c.culturaId !== culturaId),
    }));
  };

  const handleUpdateAreaCultura = (culturaId: string, areaPlantada: number) => {
    setSafraData(prev => ({
      ...prev,
      culturasPlantadas: prev.culturasPlantadas.map(c =>
        c.culturaId === culturaId ? { ...c, areaPlantada } : c
      ),
    }));
  };

  const handleSaveSafra = async () => {
    if (!propriedadeId && !isEditing) {
      showNotification('error', 'Erro', 'Salve a fazenda primeiro antes de adicionar safras.');
      return;
    }

    if (
      !safraData.ano ||
      !safraData.nome ||
      (safraData.culturasPlantadas || /* istanbul ignore next */ []).length === 0
    ) {
      showNotification(
        'error',
        'Erro',
        'Preencha todos os campos da safra e adicione pelo menos uma cultura.'
      );
      return;
    }

    // Validar áreas plantadas
    const totalAreaPlantada = (safraData.culturasPlantadas || /* istanbul ignore next */ []).reduce(
      (total, cultura) => {
        const area = Number(cultura.areaPlantada) || /* istanbul ignore next */ 0;
        return total + area;
      },
      0
    );
    const areaAgricultavel = parseFloat(fazendaData.areaAgricultavel) || 0;

    if (totalAreaPlantada > areaAgricultavel) {
      showNotification(
        'error',
        'Erro de Validação',
        `A soma das áreas plantadas (${totalAreaPlantada} ha) não pode exceder a área agricultável (${areaAgricultavel} ha).`
      );
      return;
    }

    // Verificar se todas as culturas têm área > 0
    const culturasComAreaZero = (safraData.culturasPlantadas || []).filter(c => {
      const area = Number(c.areaPlantada) || 0;
      return area <= 0;
    });
    if (culturasComAreaZero.length > 0) {
      showNotification(
        'error',
        'Erro de Validação',
        'Todas as culturas devem ter área plantada maior que zero.'
      );
      return;
    }

    try {
      const safraDataToSave = {
        nome: safraData.nome,
        ano: parseInt(safraData.ano),
        propriedadeRuralId: propriedadeId || currentPropriedade?.id || '',
      };

      let safraResult: Safra;

      if (editingSafraId) {
        safraResult = await dispatch(
          updateSafra({
            id: editingSafraId,
            data: safraDataToSave,
          })
        ).unwrap();
        showNotification('success', 'Safra Atualizada', 'Safra foi atualizada com sucesso!');
      } else {
        safraResult = await dispatch(createSafra(safraDataToSave)).unwrap();
        showNotification('success', 'Safra Adicionada', 'Safra foi adicionada com sucesso!');
      }

      // Criar cultivos para a safra
      for (const cultura of safraData.culturasPlantadas) {
        await cultivoService.create({
          culturaId: cultura.culturaId,
          propriedadeId: propriedadeId || currentPropriedade?.id || '',
          safraId: safraResult.id,
          areaCultivada: cultura.areaPlantada,
        });
      }

      setIsAddingSafra(false);
      setSafraData({
        ano: '',
        nome: '',
        propriedadeRuralId: propriedadeId || currentPropriedade?.id || '',
        culturasPlantadas: [],
      });
      setEditingSafraId(null);

      // Recarregar as safras para mostrar os cultivos
      if (propriedadeId) {
        dispatch(fetchSafrasByPropriedade(propriedadeId));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar safra:', error);
      showNotification('error', 'Erro ao Salvar', 'Erro ao salvar a safra. Tente novamente.');
    }
  };

  const handleDeleteSafra = async (safraId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta safra?')) {
      /* istanbul ignore next */
      return;
    }

    try {
      await dispatch(deleteSafra(safraId)).unwrap();
      showNotification('success', 'Safra Removida', 'Safra foi removida com sucesso!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao deletar safra:', error);
      showNotification('error', 'Erro ao Deletar', 'Erro ao deletar a safra. Tente novamente.');
    }
  };

  const handleCancelSafra = () => {
    setIsAddingSafra(false);
    setSafraData({
      ano: '',
      nome: '',
      propriedadeRuralId: propriedadeId || currentPropriedade?.id || '',
      culturasPlantadas: [],
    });
    setEditingSafraId(null);
  };

  return (
    <>
      <PageContainer>
        <PageHeader>
          <BackButton onClick={handleCancel}>← Voltar</BackButton>
          <PageTitle>{isEditing ? 'Editar Fazenda' : 'Cadastrar Nova Fazenda'}</PageTitle>
        </PageHeader>

        <FormContainer>
          <FormSection>
            <SectionTitle>Dados da Fazenda</SectionTitle>

            <FormGroup>
              <Label htmlFor='nomeFazenda'>Nome da Fazenda *</Label>
              <Input
                id='nomeFazenda'
                name='nomeFazenda'
                type='text'
                value={fazendaData.nomeFazenda || ''}
                onChange={handleInputChange}
                placeholder='Ex: Fazenda Santa Maria'
                required
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label htmlFor='cidade'>Cidade *</Label>
                <Input
                  id='cidade'
                  name='cidade'
                  type='text'
                  value={fazendaData.cidade || ''}
                  onChange={handleInputChange}
                  placeholder='Ex: Sorriso'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='estado'>Estado *</Label>
                <select
                  id='estado'
                  name='estado'
                  value={fazendaData.estado || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                  required
                >
                  <option value=''>Selecione o estado</option>
                  {ESTADOS_BRASILEIROS.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label htmlFor='areaTotal'>Área Total (ha) *</Label>
                <Input
                  id='areaTotal'
                  name='areaTotal'
                  type='number'
                  value={fazendaData.areaTotal || ''}
                  onChange={handleInputChange}
                  placeholder='0'
                  min='0'
                  step='0.01'
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='areaAgricultavel'>Área Agricultável (ha)</Label>
                <Input
                  id='areaAgricultavel'
                  name='areaAgricultavel'
                  type='number'
                  value={fazendaData.areaAgricultavel || ''}
                  onChange={handleInputChange}
                  placeholder='0'
                  min='0'
                  step='0.01'
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor='areaVegetacao'>Área de Vegetação (ha)</Label>
                <Input
                  id='areaVegetacao'
                  name='areaVegetacao'
                  type='number'
                  value={fazendaData.areaVegetacao || ''}
                  onChange={handleInputChange}
                  placeholder='0'
                  min='0'
                  step='0.01'
                />
              </FormGroup>
            </div>
          </FormSection>

          {isEditing && (
            <FormSection>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <SectionTitle>Safras da Fazenda</SectionTitle>
                {!isAddingSafra && (
                  <ActionButton
                    variant='outlined-primary'
                    onClick={handleAddSafra}
                    disabled={safrasLoading}
                  >
                    + Adicionar Safra
                  </ActionButton>
                )}
              </div>

              {isAddingSafra && (
                <div
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <h4 style={{ margin: 0, color: '#495057' }}>
                      {editingSafraId ? 'Editar Safra' : 'Adicionar Nova Safra'}
                    </h4>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <FormGroup style={{ margin: 0 }}>
                      <Label htmlFor='safraAno'>Ano *</Label>
                      <Input
                        id='safraAno'
                        name='ano'
                        type='number'
                        value={safraData.ano}
                        onChange={handleSafraInputChange}
                        placeholder='2024'
                        min='2000'
                        max='2030'
                        required
                      />
                    </FormGroup>
                    <FormGroup style={{ margin: 0 }}>
                      <Label htmlFor='safraNome'>Nome da Safra *</Label>
                      <Input
                        id='safraNome'
                        name='nome'
                        type='text'
                        value={safraData.nome}
                        onChange={handleSafraInputChange}
                        placeholder='Ex: Safra Verão 2024'
                        required
                      />
                    </FormGroup>
                  </div>

                  <FormGroup style={{ margin: '0 0 1.5rem 0' }}>
                    <Label>Culturas Plantadas *</Label>

                    <div style={{ marginBottom: '1rem' }}>
                      <select
                        aria-label='Selecione uma cultura'
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const culturaId = e.target.value;
                          if (culturaId) {
                            handleAddCultura(culturaId);
                            e.target.value = '';
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          backgroundColor: 'white',
                        }}
                      >
                        <option value=''>Selecione uma cultura para adicionar</option>
                        {culturasDisponiveis
                          .filter(
                            cultura =>
                              !safraData.culturasPlantadas.some(c => c.culturaId === cultura.id)
                          )
                          .map(cultura => (
                            <option key={cultura.id} value={cultura.id}>
                              {cultura.nome}
                            </option>
                          ))}
                      </select>
                    </div>

                    {(safraData.culturasPlantadas || []).length > 0 ? (
                      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                        {(safraData.culturasPlantadas || []).map(cultura => (
                          <div
                            key={cultura.culturaId}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 1fr auto',
                              gap: '1rem',
                              alignItems: 'center',
                              padding: '1rem',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              backgroundColor: '#f8f9fa',
                            }}
                          >
                            <div>
                              <strong>{cultura.culturaNome}</strong>
                            </div>
                            <div>
                              <Label htmlFor={`area-${cultura.culturaId}`}>Área (ha) *</Label>
                              <Input
                                id={`area-${cultura.culturaId}`}
                                type='number'
                                value={cultura.areaPlantada}
                                onChange={e =>
                                  handleUpdateAreaCultura(
                                    cultura.culturaId,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder='0.00'
                                min='0.01'
                                step='0.01'
                                style={{ marginTop: '0.25rem' }}
                                required
                              />
                            </div>
                            <button
                              type='button'
                              onClick={() => handleRemoveCultura(cultura.culturaId)}
                              style={{
                                background: '#dc3545',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                lineHeight: '1',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                width: '2.5rem',
                                height: '2.5rem',
                              }}
                              title={`Remover ${cultura.culturaNome}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <div
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: '#e7f3ff',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            color: '#0066cc',
                          }}
                        >
                          <strong>
                            Total área plantada:{' '}
                            {(safraData.culturasPlantadas || [])
                              .reduce((total, c) => {
                                const area = Number(c.areaPlantada) || 0;
                                return total + area;
                              }, 0)
                              .toFixed(2)}{' '}
                            ha
                          </strong>
                          {fazendaData.areaAgricultavel && (
                            <span> / {fazendaData.areaAgricultavel} ha disponíveis</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: '#666',
                          fontStyle: 'italic',
                          margin: '0.5rem 0 1rem 0',
                        }}
                      >
                        Nenhuma cultura selecionada
                      </p>
                    )}
                  </FormGroup>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <ActionButton
                      variant='secondary'
                      onClick={handleCancelSafra}
                      disabled={safrasLoading}
                    >
                      Cancelar
                    </ActionButton>
                    <ActionButton
                      variant='primary'
                      onClick={handleSaveSafra}
                      disabled={safrasLoading}
                    >
                      {safrasLoading ? 'Salvando...' : editingSafraId ? 'Atualizar' : 'Adicionar'}
                    </ActionButton>
                  </div>
                </div>
              )}

              <div>
                {safrasLoading ? (
                  <p>Carregando safras...</p>
                ) : !safrasPropriedade || safrasPropriedade.length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    <p>Nenhuma safra cadastrada para esta fazenda.</p>
                    <p style={{ fontSize: '0.9em', marginTop: '0.5rem' }}>
                      Clique em &quot;Adicionar Safra&quot; para cadastrar uma nova safra.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {safrasPropriedade.map(safra => (
                      <div
                        key={safra.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                        }}
                      >
                        <div>
                          <strong>{safra.nome}</strong> - Ano: {safra.ano}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton
                            variant='outlined-secondary'
                            onClick={() => handleEditSafra(safra)}
                            disabled={safrasLoading || isAddingSafra}
                            size='small'
                          >
                            Editar
                          </ActionButton>
                          <ActionButton
                            variant='outlined-danger'
                            onClick={() => handleDeleteSafra(safra.id)}
                            disabled={safrasLoading || isAddingSafra}
                            size='small'
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
                variant='outlined-secondary'
                onClick={handleCancel}
                disabled={propriedadeLoading}
              >
                Cancelar
              </ActionButton>
              <ActionButton variant='primary' onClick={handleSave} loading={propriedadeLoading}>
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
