import React, { useEffect, useState } from 'react';
import { ESTADOS_BRASILEIROS } from '../../../constants';
import { FazendaWithSafras, ProducerFormData } from '../../../types/producer';
import { formatCNPJ, formatCPF, validateCNPJ, validateCPF } from '../../../utils/validators';
import { ActionButton } from '../../shared';
import {
  ButtonContainer,
  ErrorMessage,
  FormCard,
  FormContainer,
  FormGroup,
  FormRow,
  FormSection,
  FormTitle,
  Input,
  Label,
  SectionTitle,
} from './ProducerForm.styled';

interface ProducerFormProps {
  onSubmit: (data: ProducerFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProducerFormData>;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export const ProducerForm: React.FC<ProducerFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<ProducerFormData>({
    cpfCnpj: '',
    nome: '',
    fazendas: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        cpfCnpj: initialData.cpfCnpj || '',
        nome: initialData.nome || '',
        fazendas: initialData.fazendas || [],
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cpfCnpj.trim()) {
      newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    } else {
      const cleanDoc = formData.cpfCnpj.replace(/\D/g, '');
      if (cleanDoc.length === 11) {
        if (!validateCPF(cleanDoc)) {
          newErrors.cpfCnpj = 'CPF inválido';
        }
      } else if (cleanDoc.length === 14) {
        if (!validateCNPJ(cleanDoc)) {
          newErrors.cpfCnpj = 'CNPJ inválido';
        }
      } else {
        newErrors.cpfCnpj = 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
      }
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do produtor é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ProducerFormData, value: string) => {
    let formattedValue = value;

    if (field === 'cpfCnpj') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 11) {
        formattedValue = formatCPF(cleanValue);
      } else {
        formattedValue = formatCNPJ(cleanValue);
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddFazenda = () => {
    const newFazenda: FazendaWithSafras = {
      nomeFazenda: '',
      cidade: '',
      estado: '',
      areaTotal: 0,
      areaAgricultavel: 0,
      areaVegetacao: 0,
      safras: [],
    };

    setFormData(prev => ({
      ...prev,
      fazendas: [...prev.fazendas, newFazenda],
    }));
  };

  const handleRemoveFazenda = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fazendas: prev.fazendas.filter((_, i) => i !== index),
    }));
  };

  const handleFazendaChange = (
    fazendaIndex: number,
    field: keyof Omit<FazendaWithSafras, 'safras'>,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      fazendas: prev.fazendas.map((fazenda, index) =>
        index === fazendaIndex ? { ...fazenda, [field]: value } : fazenda
      ),
    }));
  };

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>{isEditMode ? 'Editar Produtor' : 'Cadastrar Produtor'}</FormTitle>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Dados do Produtor</SectionTitle>

            <FormRow>
              <FormGroup>
                <Label>CPF/CNPJ *</Label>
                <Input
                  type='text'
                  value={formData.cpfCnpj}
                  onChange={e => handleInputChange('cpfCnpj', e.target.value)}
                  placeholder='000.000.000-00 ou 00.000.000/0000-00'
                  $hasError={!!errors.cpfCnpj}
                  maxLength={18}
                />
                {errors.cpfCnpj && <ErrorMessage>{errors.cpfCnpj}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Nome do Produtor *</Label>
                <Input
                  type='text'
                  value={formData.nome}
                  onChange={e => handleInputChange('nome', e.target.value)}
                  placeholder='Nome completo do produtor'
                  $hasError={!!errors.nome}
                />
                {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <SectionTitle>Fazendas do Produtor</SectionTitle>
              <ActionButton
                type='button'
                variant='outlined-primary'
                onClick={handleAddFazenda}
                disabled={isLoading}
                size='small'
              >
                + Adicionar Fazenda
              </ActionButton>
            </div>

            {formData.fazendas.length === 0 ? (
              <p
                style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}
              >
                Nenhuma fazenda adicionada. Clique em "Adicionar Fazenda" para começar.
              </p>
            ) : (
              formData.fazendas.map((fazenda, fazendaIndex) => (
                <div
                  key={fazendaIndex}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: '#f9f9f9',
                    position: 'relative',
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
                    <h4 style={{ margin: 0, color: '#495057' }}>Fazenda {fazendaIndex + 1}</h4>
                    <ActionButton
                      type='button'
                      variant='outlined-danger'
                      onClick={() => handleRemoveFazenda(fazendaIndex)}
                      disabled={isLoading}
                      size='small'
                    >
                      Remover Fazenda
                    </ActionButton>
                  </div>

                  <FormRow>
                    <FormGroup>
                      <Label>Nome da Fazenda *</Label>
                      <Input
                        type='text'
                        value={fazenda.nomeFazenda}
                        onChange={e =>
                          handleFazendaChange(fazendaIndex, 'nomeFazenda', e.target.value)
                        }
                        placeholder='Ex: Fazenda Santa Maria'
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>Cidade *</Label>
                      <Input
                        type='text'
                        value={fazenda.cidade}
                        onChange={e => handleFazendaChange(fazendaIndex, 'cidade', e.target.value)}
                        placeholder='Ex: Sorriso'
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Estado *</Label>
                      <select
                        value={fazenda.estado}
                        onChange={e => handleFazendaChange(fazendaIndex, 'estado', e.target.value)}
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
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>Área Total (ha) *</Label>
                      <Input
                        type='number'
                        value={fazenda.areaTotal}
                        onChange={e =>
                          handleFazendaChange(fazendaIndex, 'areaTotal', e.target.value)
                        }
                        placeholder='0'
                        min='0'
                        step='0.01'
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Área Agricultável (ha)</Label>
                      <Input
                        type='number'
                        value={fazenda.areaAgricultavel}
                        onChange={e =>
                          handleFazendaChange(fazendaIndex, 'areaAgricultavel', e.target.value)
                        }
                        placeholder='0'
                        min='0'
                        step='0.01'
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Área de Vegetação (ha)</Label>
                      <Input
                        type='number'
                        value={fazenda.areaVegetacao}
                        onChange={e =>
                          handleFazendaChange(fazendaIndex, 'areaVegetacao', e.target.value)
                        }
                        placeholder='0'
                        min='0'
                        step='0.01'
                      />
                    </FormGroup>
                  </FormRow>

                  <div
                    style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      backgroundColor: 'white',
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
                      <h5 style={{ margin: 0, color: '#495057' }}>Safras desta Fazenda</h5>
                      <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        Para editar safras, acesse a página de Propriedades
                      </span>
                    </div>

                    {fazenda.safras.length === 0 ? (
                      <p
                        style={{
                          color: '#666',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          margin: '0.5rem 0',
                        }}
                      >
                        Nenhuma safra cadastrada para esta fazenda.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {fazenda.safras.map((safra, safraIndex) => (
                          <div
                            key={safraIndex}
                            style={{
                              padding: '1rem',
                              border: '1px solid #dee2e6',
                              borderRadius: '4px',
                              backgroundColor: '#f8f9fa',
                            }}
                          >
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ color: '#495057' }}>
                                {safra.nome || `Safra ${safraIndex + 1}`}
                              </strong>
                              {safra.ano && (
                                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                                  - Ano: {safra.ano}
                                </span>
                              )}
                            </div>

                            {safra.culturasPlantadas && safra.culturasPlantadas.length > 0 ? (
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
                                  {safra.culturasPlantadas.map((cultura, culturaIndex) => (
                                    <span
                                      key={culturaIndex}
                                      style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: '#e8f5e8',
                                        border: '1px solid #4caf50',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        color: '#2e7d32',
                                      }}
                                    >
                                      {cultura}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span
                                style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}
                              >
                                Nenhuma cultura cadastrada
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </FormSection>

          <ButtonContainer>
            <ActionButton variant='secondary' onClick={onCancel} disabled={isLoading}>
              Cancelar
            </ActionButton>

            <ActionButton type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Cadastrar'}
            </ActionButton>
          </ButtonContainer>
        </form>
      </FormCard>
    </FormContainer>
  );
};
