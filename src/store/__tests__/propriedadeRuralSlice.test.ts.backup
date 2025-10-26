import { configureStore } from '@reduxjs/toolkit';
import { propriedadeRuralService } from '../../services/propriedadeRuralService';
import type { PropriedadeRural, PropriedadeRuralFormData } from '../../types/propriedadeRural';
import propriedadeRuralSlice, {
  clearCurrentPropriedade,
  clearError,
  createPropriedade,
  deletePropriedade,
  fetchPropriedadeById,
  fetchPropriedades,
  fetchPropriedadesByProdutor,
  setCurrentPropriedade,
  updatePropriedade,
} from '../propriedadeRuralSlice';

// Mock do service
jest.mock('../../services/propriedadeRuralService');
const mockedPropriedadeService = propriedadeRuralService as jest.Mocked<
  typeof propriedadeRuralService
>;

// Helper para criar store de teste
const createTestStore = () => {
  return configureStore({
    reducer: { propriedades: propriedadeRuralSlice },
  });
};

// Helper para criar propriedade completa para testes
const createMockPropriedade = (id: string, nomeFazenda: string): PropriedadeRural => ({
  id,
  nomeFazenda,
  cidade: 'São Paulo',
  estado: 'SP',
  areaTotal: 1000,
  areaAgricultavel: 800,
  areaVegetacao: 200,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

const createMockFormData = (): PropriedadeRuralFormData & { produtorId: string } => ({
  nomeFazenda: 'Fazenda Test',
  cidade: 'Campinas',
  estado: 'SP',
  areaTotal: '1500',
  areaAgricultavel: '1200',
  areaVegetacao: '300',
  produtorId: 'prod1',
});

describe('propriedadeRuralSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().propriedades;
      expect(state).toEqual({
        propriedades: [],
        currentPropriedade: null,
        loading: false,
        error: null,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should set current propriedade', () => {
      const testPropriedade = createMockPropriedade('1', 'Fazenda Test');

      store.dispatch(setCurrentPropriedade(testPropriedade));
      expect(store.getState().propriedades.currentPropriedade).toEqual(testPropriedade);
    });

    it('should clear current propriedade', () => {
      const testPropriedade = createMockPropriedade('1', 'Fazenda Test');
      store.dispatch(setCurrentPropriedade(testPropriedade));

      store.dispatch(clearCurrentPropriedade());
      expect(store.getState().propriedades.currentPropriedade).toBeNull();
    });

    it('should clear error', () => {
      // Set error first
      store.dispatch({
        type: 'propriedades/fetchPropriedades/rejected',
        error: { message: 'Test error' },
      });
      expect(store.getState().propriedades.error).toBe('Test error');

      // Clear error
      store.dispatch(clearError());
      expect(store.getState().propriedades.error).toBeNull();
    });
  });

  describe('fetchPropriedades async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchPropriedades.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockPropriedades = [
        createMockPropriedade('1', 'Fazenda A'),
        createMockPropriedade('2', 'Fazenda B'),
      ];

      mockedPropriedadeService.getAll.mockResolvedValue(mockPropriedades);

      await store.dispatch(fetchPropriedades());

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades).toEqual(mockPropriedades);
      expect(state.error).toBeNull();
      expect(mockedPropriedadeService.getAll).toHaveBeenCalled();
    });

    it('should handle rejected state', async () => {
      mockedPropriedadeService.getAll.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchPropriedades());

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Service error');
    });

    it('should handle rejected state with unknown error', async () => {
      mockedPropriedadeService.getAll.mockRejectedValue(new Error());

      await store.dispatch(fetchPropriedades());

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar propriedades');
    });
  });

  describe('fetchPropriedadesByProdutor async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchPropriedadesByProdutor.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockPropriedades = [createMockPropriedade('1', 'Fazenda Produtor')];

      mockedPropriedadeService.getByProdutor.mockResolvedValue(mockPropriedades);

      await store.dispatch(fetchPropriedadesByProdutor('prod123'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades).toEqual(mockPropriedades);
      expect(mockedPropriedadeService.getByProdutor).toHaveBeenCalledWith('prod123');
    });

    it('should handle rejected state', async () => {
      mockedPropriedadeService.getByProdutor.mockRejectedValue(
        new Error('Produtor não encontrado')
      );

      await store.dispatch(fetchPropriedadesByProdutor('prod123'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Produtor não encontrado');
    });
  });

  describe('fetchPropriedadeById async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchPropriedadeById.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockPropriedade = createMockPropriedade('1', 'Fazenda Única');

      mockedPropriedadeService.getById.mockResolvedValue(mockPropriedade);

      await store.dispatch(fetchPropriedadeById('1'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.currentPropriedade).toEqual(mockPropriedade);
      expect(mockedPropriedadeService.getById).toHaveBeenCalledWith('1');
    });

    it('should handle rejected state', async () => {
      mockedPropriedadeService.getById.mockRejectedValue(new Error('Propriedade não encontrada'));

      await store.dispatch(fetchPropriedadeById('1'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Propriedade não encontrada');
    });
  });

  describe('createPropriedade async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: createPropriedade.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const formData = createMockFormData();
      const mockPropriedade = createMockPropriedade('3', 'Fazenda Test');
      const mockCreateData = {
        nomeFazenda: 'Fazenda Test',
        cidade: 'Campinas',
        estado: 'SP',
        areaTotal: 1500,
        areaAgricultavel: 1200,
        areaVegetacao: 300,
        produtorIds: ['prod1'],
      };

      mockedPropriedadeService.convertFormToCreateData.mockReturnValue(mockCreateData);
      mockedPropriedadeService.create.mockResolvedValue(mockPropriedade);

      await store.dispatch(createPropriedade(formData));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades).toContainEqual(mockPropriedade);
      expect(mockedPropriedadeService.convertFormToCreateData).toHaveBeenCalledWith(formData, [
        'prod1',
      ]);
      expect(mockedPropriedadeService.create).toHaveBeenCalledWith(mockCreateData);
    });

    it('should handle rejected state', async () => {
      const formData = createMockFormData();
      mockedPropriedadeService.convertFormToCreateData.mockImplementation(() => {
        throw new Error('Dados inválidos');
      });

      await store.dispatch(createPropriedade(formData));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Dados inválidos');
    });
  });

  describe('updatePropriedade async thunk', () => {
    beforeEach(() => {
      // Set initial propriedades
      const initialPropriedades = [
        createMockPropriedade('1', 'Fazenda A'),
        createMockPropriedade('2', 'Fazenda B'),
      ];
      store.dispatch({
        type: fetchPropriedades.fulfilled.type,
        payload: initialPropriedades,
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: updatePropriedade.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - update in list', async () => {
      const formData: PropriedadeRuralFormData = {
        nomeFazenda: 'Fazenda Atualizada',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        areaTotal: '2000',
        areaAgricultavel: '1600',
        areaVegetacao: '400',
      };
      const updatedPropriedade = createMockPropriedade('1', 'Fazenda Atualizada');

      mockedPropriedadeService.update.mockResolvedValue(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '1', data: formData }));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades[0]).toEqual(updatedPropriedade);
      expect(mockedPropriedadeService.update).toHaveBeenCalledWith('1', {
        nomeFazenda: 'Fazenda Atualizada',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        areaTotal: 2000,
        areaAgricultavel: 1600,
        areaVegetacao: 400,
      });
    });

    it('should handle fulfilled state - update current propriedade', async () => {
      const currentPropriedade = createMockPropriedade('1', 'Fazenda A');
      store.dispatch(setCurrentPropriedade(currentPropriedade));

      const formData: PropriedadeRuralFormData = {
        nomeFazenda: 'Fazenda A Atualizada',
        cidade: 'Campinas',
        estado: 'SP',
        areaTotal: '1800',
        areaAgricultavel: '1400',
        areaVegetacao: '400',
      };
      const updatedPropriedade = createMockPropriedade('1', 'Fazenda A Atualizada');

      mockedPropriedadeService.update.mockResolvedValue(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '1', data: formData }));

      const state = store.getState().propriedades;
      expect(state.currentPropriedade).toEqual(updatedPropriedade);
    });

    it('should handle fulfilled state - ignore if propriedade not found', async () => {
      const formData: PropriedadeRuralFormData = {
        nomeFazenda: 'Fazenda Nova',
        cidade: 'Brasília',
        estado: 'DF',
        areaTotal: '1000',
        areaAgricultavel: '800',
        areaVegetacao: '200',
      };
      const updatedPropriedade = createMockPropriedade('999', 'Fazenda Nova');

      mockedPropriedadeService.update.mockResolvedValue(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '999', data: formData }));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades).toHaveLength(2); // unchanged
    });

    it('should handle rejected state', async () => {
      const formData: PropriedadeRuralFormData = {
        nomeFazenda: 'Fazenda Inválida',
        cidade: '',
        estado: '',
        areaTotal: '-1',
        areaAgricultavel: '0',
        areaVegetacao: '0',
      };
      mockedPropriedadeService.update.mockRejectedValue(new Error('Dados inválidos'));

      await store.dispatch(updatePropriedade({ id: '1', data: formData }));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Dados inválidos');
    });
  });

  describe('deletePropriedade async thunk', () => {
    beforeEach(() => {
      // Set initial propriedades
      const initialPropriedades = [
        createMockPropriedade('1', 'Fazenda A'),
        createMockPropriedade('2', 'Fazenda B'),
      ];
      store.dispatch({
        type: fetchPropriedades.fulfilled.type,
        payload: initialPropriedades,
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: deletePropriedade.pending.type });

      const state = store.getState().propriedades;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - remove from list', async () => {
      mockedPropriedadeService.delete.mockResolvedValue(undefined);

      await store.dispatch(deletePropriedade('1'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.propriedades).toHaveLength(1);
      expect(state.propriedades[0].id).toBe('2');
      expect(mockedPropriedadeService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle fulfilled state - clear current propriedade if deleted', async () => {
      const currentPropriedade = createMockPropriedade('1', 'Fazenda A');
      store.dispatch(setCurrentPropriedade(currentPropriedade));

      mockedPropriedadeService.delete.mockResolvedValue(undefined);

      await store.dispatch(deletePropriedade('1'));

      const state = store.getState().propriedades;
      expect(state.currentPropriedade).toBeNull();
    });

    it('should handle fulfilled state - keep current propriedade if different', async () => {
      const currentPropriedade = createMockPropriedade('2', 'Fazenda B');
      store.dispatch(setCurrentPropriedade(currentPropriedade));

      mockedPropriedadeService.delete.mockResolvedValue(undefined);

      await store.dispatch(deletePropriedade('1'));

      const state = store.getState().propriedades;
      expect(state.currentPropriedade).toEqual(currentPropriedade);
    });

    it('should handle rejected state', async () => {
      mockedPropriedadeService.delete.mockRejectedValue(new Error('Propriedade possui culturas'));

      await store.dispatch(deletePropriedade('1'));

      const state = store.getState().propriedades;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Propriedade possui culturas');
    });
  });
});
