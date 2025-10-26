import { configureStore } from '@reduxjs/toolkit';
import { propriedadeRuralService } from '../../services/propriedadeRuralService';
import { PropriedadeRural, PropriedadeRuralFormData } from '../../types/propriedadeRural';
import propriedadeRuralReducer, {
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

// Mock do propriedadeRuralService
jest.mock('../../services/propriedadeRuralService');

const mockPropriedadeRuralService = propriedadeRuralService as jest.Mocked<
  typeof propriedadeRuralService
>;

// Define proper store type
interface RootState {
  propriedades: ReturnType<typeof propriedadeRuralReducer>;
}

describe('propriedadeRuralSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockPropriedade: PropriedadeRural = {
    id: '1',
    nomeFazenda: 'Fazenda Teste',
    cidade: 'Cidade Teste',
    estado: 'SP',
    areaTotal: 100,
    areaAgricultavel: 60,
    areaVegetacao: 40,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockFormData: PropriedadeRuralFormData = {
    nomeFazenda: 'Fazenda Nova',
    cidade: 'Cidade Nova',
    estado: 'MG',
    areaTotal: '200',
    areaAgricultavel: '120',
    areaVegetacao: '80',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        propriedades: propriedadeRuralReducer,
      },
    }) as ReturnType<typeof configureStore<RootState>>;
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
    it('should handle setCurrentPropriedade', () => {
      store.dispatch(setCurrentPropriedade(mockPropriedade));
      const state = store.getState().propriedades;
      expect(state.currentPropriedade).toEqual(mockPropriedade);
    });

    it('should handle clearCurrentPropriedade', () => {
      // First set a propriedade
      store.dispatch(setCurrentPropriedade(mockPropriedade));
      // Then clear it
      store.dispatch(clearCurrentPropriedade());
      const state = store.getState().propriedades;
      expect(state.currentPropriedade).toBeNull();
    });

    it('should handle clearError', () => {
      // Create a store with error state
      const storeWithError = configureStore({
        reducer: {
          propriedades: propriedadeRuralReducer,
        },
        preloadedState: {
          propriedades: {
            propriedades: [],
            currentPropriedade: null,
            loading: false,
            error: 'Test error',
          },
        },
      }) as ReturnType<typeof configureStore<RootState>>;

      storeWithError.dispatch(clearError());
      const state = storeWithError.getState().propriedades;
      expect(state.error).toBeNull();
    });
  });

  describe('fetchPropriedades', () => {
    it('should handle fetchPropriedades.pending', () => {
      const action = { type: fetchPropriedades.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedades.fulfilled', async () => {
      const propriedades = [mockPropriedade];
      mockPropriedadeRuralService.getAll.mockResolvedValueOnce(propriedades);

      await store.dispatch(fetchPropriedades());
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.propriedades).toEqual(propriedades);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedades.rejected', async () => {
      const errorMessage = 'Network error';
      mockPropriedadeRuralService.getAll.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchPropriedades());
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchPropriedades.rejected with default error message', async () => {
      mockPropriedadeRuralService.getAll.mockRejectedValueOnce(new Error());

      await store.dispatch(fetchPropriedades());
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar propriedades');
    });
  });

  describe('fetchPropriedadesByProdutor', () => {
    it('should handle fetchPropriedadesByProdutor.pending', () => {
      const action = { type: fetchPropriedadesByProdutor.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedadesByProdutor.fulfilled', async () => {
      const propriedades = [mockPropriedade];
      mockPropriedadeRuralService.getByProdutor.mockResolvedValueOnce(propriedades);

      await store.dispatch(fetchPropriedadesByProdutor('prod1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.propriedades).toEqual(propriedades);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedadesByProdutor.rejected', async () => {
      const errorMessage = 'Produtor not found';
      mockPropriedadeRuralService.getByProdutor.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchPropriedadesByProdutor('invalid'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchPropriedadesByProdutor.rejected with default error message', async () => {
      mockPropriedadeRuralService.getByProdutor.mockRejectedValueOnce(new Error());

      await store.dispatch(fetchPropriedadesByProdutor('prod1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar propriedades do produtor');
    });
  });

  describe('fetchPropriedadeById', () => {
    it('should handle fetchPropriedadeById.pending', () => {
      const action = { type: fetchPropriedadeById.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedadeById.fulfilled', async () => {
      mockPropriedadeRuralService.getById.mockResolvedValueOnce(mockPropriedade);

      await store.dispatch(fetchPropriedadeById('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.currentPropriedade).toEqual(mockPropriedade);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropriedadeById.rejected', async () => {
      const errorMessage = 'Propriedade not found';
      mockPropriedadeRuralService.getById.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchPropriedadeById('999'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchPropriedadeById.rejected with default error message', async () => {
      mockPropriedadeRuralService.getById.mockRejectedValueOnce(new Error());

      await store.dispatch(fetchPropriedadeById('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao buscar propriedade');
    });
  });

  describe('createPropriedade', () => {
    it('should handle createPropriedade.pending', () => {
      const action = { type: createPropriedade.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle createPropriedade.fulfilled', async () => {
      const createData = { ...mockFormData, produtorId: 'prod1' };
      const convertedData = {
        nomeFazenda: mockFormData.nomeFazenda,
        cidade: mockFormData.cidade,
        estado: mockFormData.estado,
        areaTotal: Number(mockFormData.areaTotal),
        areaAgricultavel: Number(mockFormData.areaAgricultavel),
        areaVegetacao: Number(mockFormData.areaVegetacao),
        produtorIds: ['prod1'],
      };

      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce(convertedData);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);

      await store.dispatch(createPropriedade(createData));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.propriedades).toContain(mockPropriedade);
      expect(state.error).toBeNull();
    });

    it('should handle createPropriedade.rejected', async () => {
      const createData = { ...mockFormData, produtorId: 'prod1' };
      const errorMessage = 'Validation error';

      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce({} as any);
      mockPropriedadeRuralService.create.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(createPropriedade(createData));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle createPropriedade.rejected with default error message', async () => {
      const createData = { ...mockFormData, produtorId: 'prod1' };

      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce({} as any);
      mockPropriedadeRuralService.create.mockRejectedValueOnce(new Error());

      await store.dispatch(createPropriedade(createData));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao criar propriedade');
    });
  });

  describe('updatePropriedade', () => {
    it('should handle updatePropriedade.pending', () => {
      const action = { type: updatePropriedade.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updatePropriedade.fulfilled', async () => {
      // Setup store with initial data using create action
      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce({} as any);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);
      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod1' }));

      store.dispatch(setCurrentPropriedade(mockPropriedade));

      const updatedPropriedade = { ...mockPropriedade, nomeFazenda: 'Fazenda Atualizada' };
      mockPropriedadeRuralService.update.mockResolvedValueOnce(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '1', data: mockFormData }));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Check if propriedade was updated in the array
      const updatedInArray = state.propriedades.find(p => p.id === '1');
      expect(updatedInArray).toEqual(updatedPropriedade);

      // Check if current propriedade was updated
      expect(state.currentPropriedade).toEqual(updatedPropriedade);
    });

    it('should handle updatePropriedade.fulfilled when propriedade not in array', async () => {
      const updatedPropriedade = { ...mockPropriedade, id: '999', nomeFazenda: 'Fazenda Nova' };
      mockPropriedadeRuralService.update.mockResolvedValueOnce(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '999', data: mockFormData }));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Check that the array wasn't modified since propriedade wasn't found
      const notFound = state.propriedades.find(p => p.id === '999');
      expect(notFound).toBeUndefined();
    });

    it('should handle updatePropriedade.fulfilled when current propriedade is different', async () => {
      // Setup initial propriedade in store
      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce({} as any);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);
      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod1' }));

      // Set different current propriedade
      const differentPropriedade = { ...mockPropriedade, id: '2' };
      store.dispatch(setCurrentPropriedade(differentPropriedade));

      const updatedPropriedade = { ...mockPropriedade, nomeFazenda: 'Fazenda Atualizada' };
      mockPropriedadeRuralService.update.mockResolvedValueOnce(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '1', data: mockFormData }));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Current propriedade should remain unchanged
      expect(state.currentPropriedade).toEqual(differentPropriedade);
    });

    it('should handle updatePropriedade.rejected', async () => {
      const errorMessage = 'Update failed';
      mockPropriedadeRuralService.update.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(updatePropriedade({ id: '1', data: mockFormData }));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle updatePropriedade.rejected with default error message', async () => {
      mockPropriedadeRuralService.update.mockRejectedValueOnce(new Error());

      await store.dispatch(updatePropriedade({ id: '1', data: mockFormData }));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao atualizar propriedade');
    });
  });

  describe('deletePropriedade', () => {
    it('should handle deletePropriedade.pending', () => {
      const action = { type: deletePropriedade.pending.type };
      const state = propriedadeRuralReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle deletePropriedade.fulfilled', async () => {
      // Setup store with initial propriedades
      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValue({} as any);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);
      mockPropriedadeRuralService.create.mockResolvedValueOnce({ ...mockPropriedade, id: '2' });

      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod1' }));
      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod2' }));
      store.dispatch(setCurrentPropriedade(mockPropriedade));

      mockPropriedadeRuralService.delete.mockResolvedValueOnce(undefined);

      await store.dispatch(deletePropriedade('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Check propriedade was removed from array
      const deletedPropriedade = state.propriedades.find(p => p.id === '1');
      expect(deletedPropriedade).toBeUndefined();

      // Check current propriedade was cleared
      expect(state.currentPropriedade).toBeNull();
    });

    it('should handle deletePropriedade.fulfilled when current propriedade is different', async () => {
      // Setup store with initial propriedades
      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValue({} as any);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);
      mockPropriedadeRuralService.create.mockResolvedValueOnce({ ...mockPropriedade, id: '2' });

      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod1' }));
      await store.dispatch(createPropriedade({ ...mockFormData, produtorId: 'prod2' }));

      // Set different current propriedade
      const differentPropriedade = { ...mockPropriedade, id: '2' };
      store.dispatch(setCurrentPropriedade(differentPropriedade));

      mockPropriedadeRuralService.delete.mockResolvedValueOnce(undefined);

      await store.dispatch(deletePropriedade('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      // Check propriedade was removed from array
      const deletedPropriedade = state.propriedades.find(p => p.id === '1');
      expect(deletedPropriedade).toBeUndefined();

      // Current propriedade should remain unchanged since it's different
      expect(state.currentPropriedade).toEqual(differentPropriedade);
    });

    it('should handle deletePropriedade.rejected', async () => {
      const errorMessage = 'Delete failed';
      mockPropriedadeRuralService.delete.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(deletePropriedade('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle deletePropriedade.rejected with default error message', async () => {
      mockPropriedadeRuralService.delete.mockRejectedValueOnce(new Error());

      await store.dispatch(deletePropriedade('1'));
      const state = store.getState().propriedades;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Erro ao deletar propriedade');
    });
  });

  describe('edge cases and integration', () => {
    it('should handle multiple actions in sequence', async () => {
      // Create
      const createData = { ...mockFormData, produtorId: 'prod1' };
      mockPropriedadeRuralService.convertFormToCreateData.mockReturnValueOnce({} as any);
      mockPropriedadeRuralService.create.mockResolvedValueOnce(mockPropriedade);

      await store.dispatch(createPropriedade(createData));

      // Update
      const updatedPropriedade = { ...mockPropriedade, nomeFazenda: 'Updated' };
      mockPropriedadeRuralService.update.mockResolvedValueOnce(updatedPropriedade);

      await store.dispatch(updatePropriedade({ id: '1', data: mockFormData }));

      // Delete
      mockPropriedadeRuralService.delete.mockResolvedValueOnce(undefined);
      await store.dispatch(deletePropriedade('1'));

      const state = store.getState().propriedades;
      expect(state.propriedades).toHaveLength(0);
      expect(state.currentPropriedade).toBeNull();
    });

    it('should handle error states correctly', async () => {
      // Set error
      mockPropriedadeRuralService.getAll.mockRejectedValueOnce(new Error('Test error'));
      await store.dispatch(fetchPropriedades());

      let state = store.getState().propriedades;
      expect(state.error).toBe('Test error');

      // Clear error
      store.dispatch(clearError());
      state = store.getState().propriedades;
      expect(state.error).toBeNull();
    });
  });
});
