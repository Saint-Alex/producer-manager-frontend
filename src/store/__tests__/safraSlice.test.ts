import { configureStore } from '@reduxjs/toolkit';
import { safraService } from '../../services/safraService';
import type { Safra } from '../../types/safra';
import safraSlice, {
  clearCurrentSafra,
  clearError,
  createSafra,
  deleteSafra,
  fetchSafraById,
  fetchSafras,
  fetchSafrasByPropriedade,
  setCurrentSafra,
  updateSafra,
} from '../safraSlice';

// Mock do service
jest.mock('../../services/safraService');
const mockedSafraService = safraService as jest.Mocked<typeof safraService>;

// Helper para criar store de teste
const createTestStore = () => {
  return configureStore({
    reducer: { safras: safraSlice },
  });
};

// Helper para criar safra completa para testes
const createMockSafra = (id: string, nome: string, ano: number): Safra => ({
  id,
  nome,
  ano,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

describe('safraSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().safras;
      expect(state).toEqual({
        safras: [],
        loading: false,
        error: null,
        currentSafra: null,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should clear error', () => {
      // Set error first
      store.dispatch({ type: 'safras/fetchAll/rejected', error: { message: 'Test error' } });
      expect(store.getState().safras.error).toBe('Test error');

      // Clear error
      store.dispatch(clearError());
      expect(store.getState().safras.error).toBeNull();
    });

    it('should set current safra', () => {
      const testSafra = createMockSafra('1', 'Safra 2024', 2024);

      store.dispatch(setCurrentSafra(testSafra));
      expect(store.getState().safras.currentSafra).toEqual(testSafra);
    });

    it('should set current safra to null', () => {
      const testSafra = createMockSafra('1', 'Safra 2024', 2024);
      store.dispatch(setCurrentSafra(testSafra));

      store.dispatch(setCurrentSafra(null));
      expect(store.getState().safras.currentSafra).toBeNull();
    });

    it('should clear current safra', () => {
      const testSafra = createMockSafra('1', 'Safra 2024', 2024);
      store.dispatch(setCurrentSafra(testSafra));

      store.dispatch(clearCurrentSafra());
      expect(store.getState().safras.currentSafra).toBeNull();
    });
  });

  describe('fetchSafras async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchSafras.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockSafras = [
        createMockSafra('1', 'Safra 2024', 2024),
        createMockSafra('2', 'Safra 2023', 2023),
      ];

      mockedSafraService.getAll.mockResolvedValue(mockSafras);

      await store.dispatch(fetchSafras());

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras).toEqual(mockSafras);
      expect(state.error).toBeNull();
      expect(mockedSafraService.getAll).toHaveBeenCalled();
    });

    it('should handle rejected state', async () => {
      mockedSafraService.getAll.mockRejectedValue(new Error('Service error'));

      await store.dispatch(fetchSafras());

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Service error');
    });

    it('should handle rejected state with unknown error', async () => {
      mockedSafraService.getAll.mockRejectedValue(new Error());

      await store.dispatch(fetchSafras());

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar safras');
    });
  });

  describe('fetchSafrasByPropriedade async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchSafrasByPropriedade.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockSafras = [createMockSafra('1', 'Safra 2024', 2024)];

      mockedSafraService.getByPropriedade.mockResolvedValue(mockSafras);

      await store.dispatch(fetchSafrasByPropriedade('prop123'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras).toEqual(mockSafras);
      expect(mockedSafraService.getByPropriedade).toHaveBeenCalledWith('prop123');
    });

    it('should handle rejected state', async () => {
      mockedSafraService.getByPropriedade.mockRejectedValue(
        new Error('Propriedade não encontrada')
      );

      await store.dispatch(fetchSafrasByPropriedade('prop123'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Propriedade não encontrada');
    });
  });

  describe('fetchSafraById async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchSafraById.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockSafra = createMockSafra('1', 'Safra 2024', 2024);

      mockedSafraService.getById.mockResolvedValue(mockSafra);

      await store.dispatch(fetchSafraById('1'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.currentSafra).toEqual(mockSafra);
      expect(mockedSafraService.getById).toHaveBeenCalledWith('1');
    });

    it('should handle rejected state', async () => {
      mockedSafraService.getById.mockRejectedValue(new Error('Safra não encontrada'));

      await store.dispatch(fetchSafraById('1'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Safra não encontrada');
    });
  });

  describe('createSafra async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: createSafra.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const createData = { nome: 'Safra 2024', ano: 2024 };
      const mockSafra = createMockSafra('3', 'Safra 2024', 2024);

      mockedSafraService.create.mockResolvedValue(mockSafra);

      await store.dispatch(createSafra(createData));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras).toContainEqual(mockSafra);
      expect(mockedSafraService.create).toHaveBeenCalledWith(createData);
    });

    it('should handle rejected state', async () => {
      const createData = { nome: 'Safra 2024', ano: 2024 };
      mockedSafraService.create.mockRejectedValue(new Error('Ano já existe'));

      await store.dispatch(createSafra(createData));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ano já existe');
    });
  });

  describe('updateSafra async thunk', () => {
    beforeEach(() => {
      // Set initial safras
      const initialSafras = [
        createMockSafra('1', 'Safra 2024', 2024),
        createMockSafra('2', 'Safra 2023', 2023),
      ];
      store.dispatch({
        type: fetchSafras.fulfilled.type,
        payload: initialSafras,
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: updateSafra.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - update in list', async () => {
      const updateData = { ano: 2025 };
      const updatedSafra = createMockSafra('1', 'Safra 2024', 2025);

      mockedSafraService.update.mockResolvedValue(updatedSafra);

      await store.dispatch(updateSafra({ id: '1', data: updateData }));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras[0]).toEqual(updatedSafra);
      expect(mockedSafraService.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle fulfilled state - update current safra', async () => {
      const currentSafra = createMockSafra('1', 'Safra 2024', 2024);
      store.dispatch(setCurrentSafra(currentSafra));

      const updateData = { ano: 2025 };
      const updatedSafra = createMockSafra('1', 'Safra 2024', 2025);

      mockedSafraService.update.mockResolvedValue(updatedSafra);

      await store.dispatch(updateSafra({ id: '1', data: updateData }));

      const state = store.getState().safras;
      expect(state.currentSafra).toEqual(updatedSafra);
    });

    it('should handle fulfilled state - ignore if safra not found', async () => {
      const updateData = { ano: 2025 };
      const updatedSafra = createMockSafra('999', 'Safra Nova', 2025);

      mockedSafraService.update.mockResolvedValue(updatedSafra);

      await store.dispatch(updateSafra({ id: '999', data: updateData }));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras).toHaveLength(2); // unchanged
    });

    it('should handle rejected state', async () => {
      const updateData = { ano: 2025 };
      mockedSafraService.update.mockRejectedValue(new Error('Ano inválido'));

      await store.dispatch(updateSafra({ id: '1', data: updateData }));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ano inválido');
    });
  });

  describe('deleteSafra async thunk', () => {
    beforeEach(() => {
      // Set initial safras
      const initialSafras = [
        createMockSafra('1', 'Safra 2024', 2024),
        createMockSafra('2', 'Safra 2023', 2023),
      ];
      store.dispatch({
        type: fetchSafras.fulfilled.type,
        payload: initialSafras,
      });
    });

    it('should handle pending state', () => {
      store.dispatch({ type: deleteSafra.pending.type });

      const state = store.getState().safras;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state - remove from list', async () => {
      mockedSafraService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteSafra('1'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.safras).toHaveLength(1);
      expect(state.safras[0].id).toBe('2');
      expect(mockedSafraService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle fulfilled state - clear current safra if deleted', async () => {
      const currentSafra = createMockSafra('1', 'Safra 2024', 2024);
      store.dispatch(setCurrentSafra(currentSafra));

      mockedSafraService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteSafra('1'));

      const state = store.getState().safras;
      expect(state.currentSafra).toBeNull();
    });

    it('should handle fulfilled state - keep current safra if different', async () => {
      const currentSafra = createMockSafra('2', 'Safra 2023', 2023);
      store.dispatch(setCurrentSafra(currentSafra));

      mockedSafraService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteSafra('1'));

      const state = store.getState().safras;
      expect(state.currentSafra).toEqual(currentSafra);
    });

    it('should handle rejected state', async () => {
      mockedSafraService.delete.mockRejectedValue(new Error('Safra possui culturas'));

      await store.dispatch(deleteSafra('1'));

      const state = store.getState().safras;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Safra possui culturas');
    });
  });
});
