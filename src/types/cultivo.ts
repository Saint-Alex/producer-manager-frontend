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
  propriedadeId: string;
  safraId: string;
  areaCultivada: number;
}

export interface UpdateCultivoData {
  culturaId?: string;
  propriedadeId?: string;
  safraId?: string;
  areaCultivada?: number;
}
