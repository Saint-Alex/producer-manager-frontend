import { Cultivo } from './cultivo';

export interface Safra {
  id: string;
  nome: string;
  ano: number;
  dataInicio?: string; // Backend pode retornar Date como string ISO
  dataFim?: string; // Backend pode retornar Date como string ISO
  cultivos?: Cultivo[];
  createdAt: string; // Backend retorna como string ISO
  updatedAt: string; // Backend retorna como string ISO
}

export interface CreateSafraData {
  nome: string;
  ano: number;
}

export interface UpdateSafraData {
  nome?: string;
  ano?: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface SafraFormData {
  nome: string;
  ano: string; // Formulário usa string, converte depois
  dataInicio?: string;
  dataFim?: string;
  culturasPlantadas: string[]; // Para compatibilidade com formulários existentes
}
