import { configureStore } from '@reduxjs/toolkit';
import { culturaService } from '../../services/culturaService';
import type { Cultura } from '../../types/cultura';
import culturaSlice, {
    clearCurrentCultura,
    clearError,
    createCultura,
    deleteCultura,
    fetchCulturaById,
    fetchCulturas,
    fetchCulturasByPropriedade,
    fetchCulturasBySafra,
    setCurrentCultura,
    updateCultura,
} from '../culturaSlice';

// Mock do service
jest.mock('../../services/culturaService');
const mockedCulturaService = culturaService as jest.Mocked<typeof culturaService>;

// Helper para criar store de teste
const createTestStore = () => {
  return configureStore({
    reducer: { cultura: culturaSlice },
  });
};

// Helper para criar cultura completa para testes
const createMockCultura = (id: string, nome: string): Cultura => ({
  id,
  nome,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

describe('culturaSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().cultura;
      expect(state).toEqual({
        culturas: [],
        loading: false,
        error: null,
        currentCultura: null,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should clear error', () => {
      // Set error first
      store.dispatch({ type: 'cultura/fetchCulturas/rejected', payload: 'Test error' });
      expect(store.getState().cultura.error).toBe('Test error');

      // Clear error
      store.dispatch(clearError());
      expect(store.getState().cultura.error).toBeNull();
    });

    it('should clear current cultura', () => {
      const testCultura = createMockCultura('1', 'Milho');

      // Set current cultura first
      store.dispatch(setCurrentCultura(testCultura));
      expect(store.getState().cultura.currentCultura).toEqual(testCultura);

      // Clear current cultura
      store.dispatch(clearCurrentCultura());
      expect(store.getState().cultura.currentCultura).toBeNull();
    });

    it('should set current cultura', () => {
      const testCultura = createMockCultura('1', 'Soja');

      store.dispatch(setCurrentCultura(testCultura));
      expect(store.getState().cultura.currentCultura).toEqual(testCultura);
    });
  });

  describe('fetchCulturas async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchCulturas.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockCulturas = [
        createMockCultura('1', 'Milho'),
        createMockCultura('2', 'Soja'),
      ];

      mockedCulturaService.getAll.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturas());

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toEqual(mockCulturas);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', async () => {
      mockedCulturaService.getAll.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchCulturas());

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar culturas');
    });
  });

  describe('fetchCulturasByPropriedade async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchCulturasByPropriedade.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockCulturas = [
        createMockCultura('1', 'Milho'),
      ];

      mockedCulturaService.getByPropriedade.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturasByPropriedade('123'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toEqual(mockCulturas);
      expect(mockedCulturaService.getByPropriedade).toHaveBeenCalledWith('123');
    });

    it('should handle rejected state', async () => {
      mockedCulturaService.getByPropriedade.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchCulturasByPropriedade('123'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar culturas da propriedade');
    });
  });

  describe('fetchCulturasBySafra async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchCulturasBySafra.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockCulturas = [
        createMockCultura('1', 'Soja'),
      ];

      mockedCulturaService.getBySafra.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturasBySafra('456'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toEqual(mockCulturas);
      expect(mockedCulturaService.getBySafra).toHaveBeenCalledWith('456');
    });

    it('should handle rejected state', async () => {
      mockedCulturaService.getBySafra.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchCulturasBySafra('456'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar culturas da safra');
    });
  });

  describe('fetchCulturaById async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchCulturaById.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockCultura = createMockCultura('1', 'Milho');

      mockedCulturaService.getById.mockResolvedValue(mockCultura);

      await store.dispatch(fetchCulturaById('1'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.currentCultura).toEqual(mockCultura);
      expect(mockedCulturaService.getById).toHaveBeenCalledWith('1');
    });

    it('should handle rejected state', async () => {
      mockedCulturaService.getById.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchCulturaById('1'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar cultura');
    });
  });

  describe('createCultura async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: createCultura.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const createData = { nome: 'Feijão' };
      const mockCultura = createMockCultura('3', 'Feijão');

      mockedCulturaService.create.mockResolvedValue(mockCultura);

      await store.dispatch(createCultura(createData));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toContainEqual(mockCultura);
      expect(mockedCulturaService.create).toHaveBeenCalledWith(createData);
    });

    it('should handle rejected state', async () => {
      const createData = { nome: 'Feijão' };
      mockedCulturaService.create.mockRejectedValue(new Error('Service error'));

      await store.dispatch(createCultura(createData));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao criar cultura');
    });
  });

  describe('updateCultura async thunk', () => {
    beforeEach(() => {
      // Set initial culturas
      const initialCulturas = [
        createMockCultura('1', 'Milho'),
        createMockCultura('2', 'Soja'),
      ];
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: initialCulturas
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: updateCultura.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - update in list', async () => {
      const updateData = { nome: 'Milho Híbrido' };
      const updatedCultura = createMockCultura('1', 'Milho Híbrido');

      mockedCulturaService.update.mockResolvedValue(updatedCultura);

      await store.dispatch(updateCultura({ id: '1', data: updateData }));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas[0]).toEqual(updatedCultura);
      expect(mockedCulturaService.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle fulfilled state - update current cultura', async () => {
      const currentCultura = createMockCultura('1', 'Milho');
      store.dispatch(setCurrentCultura(currentCultura));

      const updateData = { nome: 'Milho Atualizado' };
      const updatedCultura = createMockCultura('1', 'Milho Atualizado');

      mockedCulturaService.update.mockResolvedValue(updatedCultura);

      await store.dispatch(updateCultura({ id: '1', data: updateData }));

      const state = store.getState().cultura;
      expect(state.currentCultura).toEqual(updatedCultura);
    });

    it('should handle rejected state', async () => {
      const updateData = { nome: 'Milho Híbrido' };
      mockedCulturaService.update.mockRejectedValue(new Error('Service error'));

      await store.dispatch(updateCultura({ id: '1', data: updateData }));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao atualizar cultura');
    });
  });

  describe('deleteCultura async thunk', () => {
    beforeEach(() => {
      // Set initial culturas
      const initialCulturas = [
        createMockCultura('1', 'Milho'),
        createMockCultura('2', 'Soja'),
      ];
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: initialCulturas
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: deleteCultura.pending.type });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - remove from list', async () => {
      mockedCulturaService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteCultura('1'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toHaveLength(1);
      expect(state.culturas[0].id).toBe('2');
      expect(mockedCulturaService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle fulfilled state - clear current cultura if deleted', async () => {
      const currentCultura = createMockCultura('1', 'Milho');
      store.dispatch(setCurrentCultura(currentCultura));

      mockedCulturaService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteCultura('1'));

      const state = store.getState().cultura;
      expect(state.currentCultura).toBeNull();
    });

    it('should handle fulfilled state - keep current cultura if different', async () => {
      const currentCultura = createMockCultura('2', 'Soja');
      store.dispatch(setCurrentCultura(currentCultura));

      mockedCulturaService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteCultura('1'));

      const state = store.getState().cultura;
      expect(state.currentCultura).toEqual(currentCultura);
    });

    it('should handle rejected state', async () => {
      mockedCulturaService.delete.mockRejectedValue(new Error('Service error'));

      await store.dispatch(deleteCultura('1'));

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao deletar cultura');
    });
  });
});
