import { Cultivo } from './cultivo';

export interface Cultura {
  id: string;
  nome: string;
  descricao?: string;
  cultivos?: Cultivo[];
  createdAt: string; // Backend retorna como string ISO
  updatedAt: string; // Backend retorna como string ISO
}

export interface CreateCulturaData {
  nome: string;
  descricao?: string;
}

export interface UpdateCulturaData {
  nome?: string;
  descricao?: string;
}
