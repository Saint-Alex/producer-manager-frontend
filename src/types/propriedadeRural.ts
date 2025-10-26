import { Cultivo } from './cultivo';
import { Producer } from './producer';

export interface PropriedadeRural {
  id: string;
  nomeFazenda: string;
  cidade: string;
  estado: string;
  areaTotal: string | number; // Backend retorna como string decimal
  areaAgricultavel: string | number; // Backend retorna como string decimal
  areaVegetacao: string | number; // Backend retorna como string decimal
  produtores?: Producer[]; // Relacionamento many-to-many
  cultivos?: Cultivo[]; // Relacionamento com cultivos
  safra?: {
    // Relacionamento 1:1 com safra (opcional, pois propriedade pode não ter safra)
    id: string;
    nome: string;
    ano: number;
    dataInicio?: string;
    dataFim?: string;
  } | null;
  createdAt: string; // Backend retorna como string ISO
  updatedAt: string; // Backend retorna como string ISO
}

export interface CreatePropriedadeData {
  nomeFazenda: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
  produtorIds?: string[]; // IDs dos produtores para relacionar
}

export interface UpdatePropriedadeData {
  nomeFazenda?: string;
  cidade?: string;
  estado?: string;
  areaTotal?: number;
  areaAgricultavel?: number;
  areaVegetacao?: number;
  produtorIds?: string[];
}

export interface PropriedadeRuralFormData {
  nomeFazenda: string;
  cidade: string;
  estado: string;
  areaTotal: string; // Formulário ainda usa string, converte depois
  areaAgricultavel: string;
  areaVegetacao: string;
}
