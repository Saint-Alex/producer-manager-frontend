import { PropriedadeRural } from './propriedadeRural';

export interface Producer {
  id: string;
  cpfCnpj: string;
  nome: string; // Corrigido de nome para nome
  propriedades?: PropriedadeRural[]; // Relacionamento com propriedades
  createdAt: string; // Backend retorna como string ISO
  updatedAt: string; // Backend retorna como string ISO
}

export interface CreateProducerData {
  cpfCnpj: string;
  nome: string;
}

export interface UpdateProducerData {
  cpfCnpj?: string;
  nome?: string;
}

export interface FazendaWithSafras {
  nomeFazenda: string;
  cidade: string;
  estado: string;
  areaTotal: number; // Corrigido de areaTotal para areaTotal (number)
  areaAgricultavel: number; // Corrigido de areaAgricultavel
  areaVegetacao: number; // Corrigido de areaVegetacao
  safras: Array<{
    ano: number; // Backend espera number
    nome: string;
    culturasPlantadas: string[];
  }>;
}

export interface ProducerFormData {
  cpfCnpj: string;
  nome: string; // Corrigido de nome para nome
  fazendas: FazendaWithSafras[];
}
