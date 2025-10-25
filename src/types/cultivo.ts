import { Cultura } from './cultura';
import { PropriedadeRural } from './propriedadeRural';
import { Safra } from './safra';

export interface Cultivo {
  id: string;
  cultura: Cultura;
  propriedadeRural: PropriedadeRural;
  safra: Safra;
  areaPlantada: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCultivoData {
  culturaId: string;
  propriedadeRuralId: string;
  safraId: string;
  areaPlantada: number;
}

export interface UpdateCultivoData {
  culturaId?: string;
  propriedadeRuralId?: string;
  safraId?: string;
  areaPlantada?: number;
}
