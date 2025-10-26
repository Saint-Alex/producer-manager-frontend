import { configureStore } from '@reduxjs/toolkit';
import { producerService } from '../../services/producerService';
import { CreateProducerData, Producer, UpdateProducerData } from '../../types/producer';
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

jest.mock('../../services/producerService');

const mockedProducerService = producerService as jest.Mocked<typeof producerService>;

const mockProducers: Producer[] = [
  {
    id: '1',
    cpfCnpj: '123.456.789-10',
    nome: 'João Silva',
    createdAt: new Date('2023-01-01').toISOString(),
    updatedAt: new Date('2023-01-01').toISOString(),
  },
  {
    id: '2',
    cpfCnpj: '987.654.321-00',
    nome: 'Maria Santos',
    createdAt: new Date('2023-01-02').toISOString(),
    updatedAt: new Date('2023-01-02').toISOString(),
  },
];

const mockProducer: Producer = mockProducers[0];

const mockCreateProducerData: CreateProducerData = {
  cpfCnpj: '111.222.333-44',
  nome: 'Pedro Oliveira',
};

const mockUpdateProducerData: UpdateProducerData = {
  nome: 'João Silva Atualizado',
};

describe('producerSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        producers: producerSlice,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().producers;
      expect(state.producers).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.currentProducer).toBeNull();
    });
  });

  describe('synchronous actions', () => {
    it('should handle addProducer', () => {
      store.dispatch(addProducer(mockProducer));
      const state = store.getState().producers;

      expect(state.producers).toHaveLength(1);
      expect(state.producers[0]).toEqual(mockProducer);
    });

    it('should handle setCurrentProducer', () => {
      store.dispatch(setCurrentProducer(mockProducer));
      const state = store.getState().producers;

      expect(state.currentProducer).toEqual(mockProducer);
    });

    it('should handle setCurrentProducer with null', () => {
      // First set a producer
      store.dispatch(setCurrentProducer(mockProducer));
      // Then set it to null
      store.dispatch(setCurrentProducer(null));
      const state = store.getState().producers;

      expect(state.currentProducer).toBeNull();
    });

    it('should handle clearCurrentProducer', () => {
      // First set a producer
      store.dispatch(setCurrentProducer(mockProducer));
      // Then clear it
      store.dispatch(clearCurrentProducer());
      const state = store.getState().producers;

      expect(state.currentProducer).toBeNull();
    });

    it('should handle clearError', () => {
      // First set an error manually by dispatching a rejected action
      const errorAction = {
        type: fetchProducers.rejected.type,
        error: { message: 'Test error' },
      };
      store.dispatch(errorAction);

      // Verify error is set
      let state = store.getState().producers;
      expect(state.error).toBe('Test error');

      // Clear the error
      store.dispatch(clearError());
      state = store.getState().producers;
      expect(state.error).toBeNull();
    });
  });

  describe('fetchProducers async thunk', () => {
    it('should handle fetchProducers.pending', () => {
      const action = { type: fetchProducers.pending.type };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchProducers.fulfilled', () => {
      const action = {
        type: fetchProducers.fulfilled.type,
        payload: mockProducers,
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers).toEqual(mockProducers);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchProducers.rejected', () => {
      const action = {
        type: fetchProducers.rejected.type,
        error: { message: 'Erro ao carregar producers' },
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao carregar producers');
    });

    it('should handle fetchProducers.rejected without error message', () => {
      const action = {
        type: fetchProducers.rejected.type,
        error: {},
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao buscar produtores');
    });

    it('should fetch producers successfully with real async thunk', async () => {
      mockedProducerService.getAll.mockResolvedValue(mockProducers);

      await store.dispatch(fetchProducers());
      const state = store.getState().producers;

      expect(mockedProducerService.getAll).toHaveBeenCalledTimes(1);
      expect(state.loading).toBe(false);
      expect(state.producers).toEqual(mockProducers);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProducers failure with real async thunk', async () => {
      const errorMessage = 'Network Error';
      mockedProducerService.getAll.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchProducers());
      const state = store.getState().producers;

      expect(mockedProducerService.getAll).toHaveBeenCalledTimes(1);
      expect(state.loading).toBe(false);
      expect(state.producers).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchProducerById async thunk', () => {
    it('should handle fetchProducerById.pending', () => {
      const action = { type: fetchProducerById.pending.type };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchProducerById.fulfilled', () => {
      const action = {
        type: fetchProducerById.fulfilled.type,
        payload: mockProducer,
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.currentProducer).toEqual(mockProducer);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchProducerById.rejected', () => {
      const action = {
        type: fetchProducerById.rejected.type,
        error: { message: 'Producer not found' },
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Producer not found');
    });

    it('should handle fetchProducerById.rejected without error message', () => {
      const action = {
        type: fetchProducerById.rejected.type,
        error: {},
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao buscar produtor');
    });

    it('should fetch producer by id successfully with real async thunk', async () => {
      mockedProducerService.getById.mockResolvedValue(mockProducer);

      await store.dispatch(fetchProducerById('1'));
      const state = store.getState().producers;

      expect(mockedProducerService.getById).toHaveBeenCalledWith('1');
      expect(state.loading).toBe(false);
      expect(state.currentProducer).toEqual(mockProducer);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProducerById failure with real async thunk', async () => {
      const errorMessage = 'Producer not found';
      mockedProducerService.getById.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchProducerById('999'));
      const state = store.getState().producers;

      expect(mockedProducerService.getById).toHaveBeenCalledWith('999');
      expect(state.loading).toBe(false);
      expect(state.currentProducer).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('createProducer async thunk', () => {
    it('should handle createProducer.pending', () => {
      const action = { type: createProducer.pending.type };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle createProducer.fulfilled', () => {
      const newProducer = { ...mockProducer, id: '3' };
      const action = {
        type: createProducer.fulfilled.type,
        payload: newProducer,
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers).toContain(newProducer);
      expect(newState.error).toBeNull();
    });

    it('should handle createProducer.rejected', () => {
      const action = {
        type: createProducer.rejected.type,
        error: { message: 'Validation failed' },
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Validation failed');
    });

    it('should handle createProducer.rejected without error message', () => {
      const action = {
        type: createProducer.rejected.type,
        error: {},
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao criar produtor');
    });

    it('should create producer successfully with real async thunk', async () => {
      const newProducer = { ...mockProducer, id: '3', ...mockCreateProducerData };
      mockedProducerService.create.mockResolvedValue(newProducer);

      await store.dispatch(createProducer(mockCreateProducerData));
      const state = store.getState().producers;

      expect(mockedProducerService.create).toHaveBeenCalledWith(mockCreateProducerData);
      expect(state.loading).toBe(false);
      expect(state.producers).toContain(newProducer);
      expect(state.error).toBeNull();
    });

    it('should handle createProducer failure with real async thunk', async () => {
      const errorMessage = 'CPF already exists';
      mockedProducerService.create.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(createProducer(mockCreateProducerData));
      const state = store.getState().producers;

      expect(mockedProducerService.create).toHaveBeenCalledWith(mockCreateProducerData);
      expect(state.loading).toBe(false);
      expect(state.producers).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateProducer async thunk', () => {
    beforeEach(() => {
      // Start with a producer in the store
      store.dispatch(addProducer(mockProducer));
    });

    it('should handle updateProducer.pending', () => {
      const action = { type: updateProducer.pending.type };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle updateProducer.fulfilled', () => {
      const updatedProducer = { ...mockProducer, nome: 'João Silva Atualizado' };
      const action = {
        type: updateProducer.fulfilled.type,
        payload: updatedProducer,
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers[0]).toEqual(updatedProducer);
      expect(newState.error).toBeNull();
    });

    it('should handle updateProducer.fulfilled for non-existing producer', () => {
      const nonExistingProducer = { ...mockProducer, id: '999' };
      const action = {
        type: updateProducer.fulfilled.type,
        payload: nonExistingProducer,
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers).toHaveLength(1);
      expect(newState.producers[0]).toEqual(mockProducer); // Original producer unchanged
      expect(newState.error).toBeNull();
    });

    it('should handle updateProducer.rejected', () => {
      const action = {
        type: updateProducer.rejected.type,
        error: { message: 'Producer not found' },
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Producer not found');
    });

    it('should handle updateProducer.rejected without error message', () => {
      const action = {
        type: updateProducer.rejected.type,
        error: {},
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao atualizar produtor');
    });

    it('should update producer successfully with real async thunk', async () => {
      const updatedProducer = { ...mockProducer, ...mockUpdateProducerData };
      mockedProducerService.update.mockResolvedValue(updatedProducer);

      await store.dispatch(updateProducer({ id: '1', data: mockUpdateProducerData }));
      const state = store.getState().producers;

      expect(mockedProducerService.update).toHaveBeenCalledWith('1', mockUpdateProducerData);
      expect(state.loading).toBe(false);
      expect(state.producers[0]).toEqual(updatedProducer);
      expect(state.error).toBeNull();
    });

    it('should handle updateProducer failure with real async thunk', async () => {
      const errorMessage = 'Validation failed';
      mockedProducerService.update.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(updateProducer({ id: '1', data: mockUpdateProducerData }));
      const state = store.getState().producers;

      expect(mockedProducerService.update).toHaveBeenCalledWith('1', mockUpdateProducerData);
      expect(state.loading).toBe(false);
      expect(state.producers[0]).toEqual(mockProducer); // Original producer unchanged
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('deleteProducer async thunk', () => {
    beforeEach(() => {
      // Start with producers in the store
      store.dispatch(addProducer(mockProducers[0]));
      store.dispatch(addProducer(mockProducers[1]));
    });

    it('should handle deleteProducer.pending', () => {
      const action = { type: deleteProducer.pending.type };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle deleteProducer.fulfilled', () => {
      const action = {
        type: deleteProducer.fulfilled.type,
        payload: '1',
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers).toHaveLength(1);
      expect(newState.producers[0].id).toBe('2');
      expect(newState.error).toBeNull();
    });

    it('should handle deleteProducer.fulfilled for non-existing producer', () => {
      const action = {
        type: deleteProducer.fulfilled.type,
        payload: '999',
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.producers).toHaveLength(2); // No change
      expect(newState.error).toBeNull();
    });

    it('should handle deleteProducer.rejected', () => {
      const action = {
        type: deleteProducer.rejected.type,
        error: { message: 'Producer not found' },
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Producer not found');
    });

    it('should handle deleteProducer.rejected without error message', () => {
      const action = {
        type: deleteProducer.rejected.type,
        error: {},
      };
      const state = store.getState().producers;
      const newState = producerSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Erro ao deletar produtor');
    });

    it('should delete producer successfully with real async thunk', async () => {
      mockedProducerService.delete.mockResolvedValue();

      await store.dispatch(deleteProducer('1'));
      const state = store.getState().producers;

      expect(mockedProducerService.delete).toHaveBeenCalledWith('1');
      expect(state.loading).toBe(false);
      expect(state.producers).toHaveLength(1);
      expect(state.producers[0].id).toBe('2');
      expect(state.error).toBeNull();
    });

    it('should handle deleteProducer failure with real async thunk', async () => {
      const errorMessage = 'Cannot delete producer';
      mockedProducerService.delete.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(deleteProducer('1'));
      const state = store.getState().producers;

      expect(mockedProducerService.delete).toHaveBeenCalledWith('1');
      expect(state.loading).toBe(false);
      expect(state.producers).toHaveLength(2); // No change
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create a producer
      const newProducer = { ...mockProducer, id: '3' };
      mockedProducerService.create.mockResolvedValue(newProducer);
      await store.dispatch(createProducer(mockCreateProducerData));

      // Fetch all producers
      mockedProducerService.getAll.mockResolvedValue([newProducer]);
      await store.dispatch(fetchProducers());

      // Update the producer
      const updatedProducer = { ...newProducer, nome: 'Updated Name' };
      mockedProducerService.update.mockResolvedValue(updatedProducer);
      await store.dispatch(updateProducer({ id: '3', data: { nome: 'Updated Name' } }));

      const state = store.getState().producers;
      expect(state.producers).toHaveLength(1);
      expect(state.producers[0].nome).toBe('Updated Name');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle error recovery', async () => {
      // First operation fails
      mockedProducerService.getAll.mockRejectedValue(new Error('Network Error'));
      await store.dispatch(fetchProducers());

      let state = store.getState().producers;
      expect(state.error).toBe('Network Error');

      // Clear error and retry
      store.dispatch(clearError());
      mockedProducerService.getAll.mockResolvedValue(mockProducers);
      await store.dispatch(fetchProducers());

      state = store.getState().producers;
      expect(state.error).toBeNull();
      expect(state.producers).toEqual(mockProducers);
    });

    it('should maintain currentProducer state through operations', async () => {
      store.dispatch(setCurrentProducer(mockProducer));

      // Fetch producers should not affect currentProducer
      mockedProducerService.getAll.mockResolvedValue(mockProducers);
      await store.dispatch(fetchProducers());

      const state = store.getState().producers;
      expect(state.currentProducer).toEqual(mockProducer);
      expect(state.producers).toEqual(mockProducers);
    });
  });
});
