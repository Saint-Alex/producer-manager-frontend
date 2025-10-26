import { configureStore } from '@reduxjs/toolkit';
import { producerService } from '../../services/producerService';
import producerSlice, {
  addProducer,
  clearCurrentProducer,
  clearError,
  createProducer,
  deleteProducer,
  fetchProducerById,
  fetchProducers,
  setCurrentProducer,
  updateProducer,
} from '../producerSlice';

// Mock do producerService
jest.mock('../../services/producerService', () => ({
  producerService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  },
}));

const mockProducerService = producerService as jest.Mocked<typeof producerService>;

const createTestStore = () => {
  return configureStore({
    reducer: {
      producers: producerSlice,
    },
  });
};

const mockProducer = {
  id: '1',
  nome: 'João Silva',
  cpfCnpj: '12345678901',
  telefone: '11999999999',
  endereco: 'Rua Test, 123',
  fazendas: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('producerSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().producers;

      expect(state).toEqual({
        producers: [],
        currentProducer: null,
        loading: false,
        error: null,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should clear error', () => {
      // First set an error
      const initialState = {
        producers: [],
        currentProducer: null,
        loading: false,
        error: 'Test error',
      };

      const action = clearError();
      const newState = producerSlice(initialState, action);

      expect(newState.error).toBeNull();
    });

    it('should set current producer', () => {
      const action = setCurrentProducer(mockProducer);
      const newState = producerSlice(undefined, action);

      expect(newState.currentProducer).toEqual(mockProducer);
    });

    it('should clear current producer', () => {
      const initialState = {
        producers: [],
        currentProducer: mockProducer,
        loading: false,
        error: null,
      };

      const action = clearCurrentProducer();
      const newState = producerSlice(initialState, action);

      expect(newState.currentProducer).toBeNull();
    });

    it('should add producer', () => {
      const action = addProducer(mockProducer);
      const newState = producerSlice(undefined, action);

      expect(newState.producers).toContain(mockProducer);
    });
  });

  describe('createProducer async thunk', () => {
    it('should handle successful producer creation', async () => {
      const newProducerData = {
        nome: 'João Silva',
        cpfCnpj: '12345678901',
      };

      mockProducerService.create.mockResolvedValueOnce(mockProducer);

      await store.dispatch(createProducer(newProducerData));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.producers).toContain(mockProducer);
      expect(mockProducerService.create).toHaveBeenCalledWith(newProducerData);
    });

    it('should handle failed producer creation', async () => {
      const newProducerData = {
        nome: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const errorMessage = 'Creation failed';
      mockProducerService.create.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(createProducer(newProducerData));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.producers).toHaveLength(0);
    });

    it('should set loading state during creation', () => {
      mockProducerService.create.mockImplementationOnce(() => new Promise(() => {}));

      store.dispatch(
        createProducer({
          nome: 'João Silva',
          cpfCnpj: '12345678901',
        })
      );

      const state = store.getState().producers;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('updateProducer async thunk', () => {
    it('should handle successful producer update', async () => {
      const updatedProducer = { ...mockProducer, nome: 'João Updated' };

      // Set initial state with the producer
      store.dispatch(setCurrentProducer(mockProducer));
      store.dispatch(addProducer(mockProducer));

      mockProducerService.update.mockResolvedValueOnce(updatedProducer);

      await store.dispatch(
        updateProducer({
          id: '1',
          data: { nome: 'João Updated' },
        })
      );

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.producers.find(p => p.id === '1')?.nome).toBe('João Updated');
      expect(mockProducerService.update).toHaveBeenCalledWith('1', { nome: 'João Updated' });
    });

    it('should handle failed producer update', async () => {
      const errorMessage = 'Update failed';
      mockProducerService.update.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(
        updateProducer({
          id: '1',
          data: { nome: 'João Updated' },
        })
      );

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('deleteProducer async thunk', () => {
    it('should handle successful producer deletion', async () => {
      // Set initial state with the producer
      store.dispatch(addProducer(mockProducer));

      mockProducerService.delete.mockResolvedValueOnce(undefined);

      await store.dispatch(deleteProducer('1'));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.producers.find(p => p.id === '1')).toBeUndefined();
      expect(mockProducerService.delete).toHaveBeenCalledWith('1');
    });

    it('should handle failed producer deletion', async () => {
      const errorMessage = 'Deletion failed';
      mockProducerService.delete.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(deleteProducer('1'));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchProducers async thunk', () => {
    it('should handle successful producers fetch', async () => {
      const producers = [mockProducer];
      mockProducerService.getAll.mockResolvedValueOnce(producers);

      await store.dispatch(fetchProducers());

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.producers).toEqual(producers);
      expect(mockProducerService.getAll).toHaveBeenCalled();
    });

    it('should handle failed producers fetch', async () => {
      const errorMessage = 'Fetch failed';
      mockProducerService.getAll.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchProducers());

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.producers).toEqual([]);
    });
  });

  describe('fetchProducerById async thunk', () => {
    it('should handle successful producer fetch by id', async () => {
      mockProducerService.getById.mockResolvedValueOnce(mockProducer);

      await store.dispatch(fetchProducerById('1'));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.currentProducer).toEqual(mockProducer);
      expect(mockProducerService.getById).toHaveBeenCalledWith('1');
    });

    it('should handle failed producer fetch by id', async () => {
      const errorMessage = 'Producer not found';
      mockProducerService.getById.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchProducerById('999'));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentProducer).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle update with non-existent producer id', async () => {
      const updatedProducer = { ...mockProducer, id: '999', nome: 'Updated' };
      mockProducerService.update.mockResolvedValueOnce(updatedProducer);

      await store.dispatch(
        updateProducer({
          id: '999',
          data: { nome: 'Updated' },
        })
      );

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      // Should not update any existing producer since id doesn't exist
      expect(state.producers.find(p => p.id === '999')).toBeUndefined();
    });

    it('should handle delete with non-existent producer id', async () => {
      mockProducerService.delete.mockResolvedValueOnce(undefined);

      await store.dispatch(deleteProducer('999'));

      const state = store.getState().producers;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      // Should not affect the producers array
      expect(state.producers).toEqual([]);
    });

    it('should handle setting current producer to null', () => {
      const action = setCurrentProducer(null);
      const newState = producerSlice(undefined, action);

      expect(newState.currentProducer).toBeNull();
    });
  });
});
