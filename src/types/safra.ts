import { Cultivo } from './cultivo';
import { PropriedadeRural } from './propriedadeRural';

export interface Safra {
  id: string;
  nome: string;
  ano: number;
  dataInicio?: string; // Backend pode retornar Date como string ISO
  dataFim?: string; // Backend pode retornar Date como string ISO
  propriedadeRural?: PropriedadeRural; // Relacionamento 1:1 com propriedade
  cultivos?: Cultivo[];
  createdAt: string; // Backend retorna como string ISO
  updatedAt: string; // Backend retorna como string ISO
}

export interface CreateSafraData {
  nome: string;
  ano: number;
  propriedadeRuralId: string; // Obrigatório no novo modelo
}

export interface UpdateSafraData {
  nome?: string;
  ano?: number;
  dataInicio?: string;
  dataFim?: string;
  propriedadeRuralId?: string; // Permite mudança de propriedade se necessário
}

export interface SafraFormData {
  nome: string;
  ano: string; // Formulário usa string, converte depois
  propriedadeRuralId: string; // Seleção da propriedade no formulário
  dataInicio?: string;
  dataFim?: string;
  culturasPlantadas?: Array<{
    culturaId: string;
    culturaNome: string;
    areaPlantada: number;
  }>; // Culturas com área plantada
}
