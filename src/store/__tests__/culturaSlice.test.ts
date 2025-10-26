import { configureStore } from '@reduxjs/toolkit';
import { culturaService } from '../../services/culturaService';
import { CreateCulturaData, Cultura, UpdateCulturaData } from '../../types/cultura';
import culturaReducer, {
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

// Mock the culturaService
jest.mock('../../services/culturaService');
const mockedCulturaService = culturaService as jest.Mocked<typeof culturaService>;

const mockCultura: Cultura = {
  id: '1',
  nome: 'Milho',
  descricao: 'Cultura de milho',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const mockCulturas: Cultura[] = [
  mockCultura,
  {
    id: '2',
    nome: 'Soja',
    descricao: 'Cultura de soja',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

interface RootState {
  cultura: ReturnType<typeof culturaReducer>;
}

describe('culturaSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cultura: culturaReducer,
      },
    });
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
      // First set an error
      store.dispatch({
        type: fetchCulturas.rejected.type,
        payload: 'Test error',
      });

      // Then clear it
      store.dispatch(clearError());

      const state = store.getState().cultura;
      expect(state.error).toBeNull();
    });

    it('should clear current cultura', () => {
      // First set a current cultura
      store.dispatch(setCurrentCultura(mockCultura));
      expect(store.getState().cultura.currentCultura).toEqual(mockCultura);

      // Then clear it
      store.dispatch(clearCurrentCultura());

      const state = store.getState().cultura;
      expect(state.currentCultura).toBeNull();
    });

    it('should set current cultura', () => {
      store.dispatch(setCurrentCultura(mockCultura));

      const state = store.getState().cultura;
      expect(state.currentCultura).toEqual(mockCultura);
    });
  });

  describe('fetchCulturas', () => {
    it('should handle fetchCulturas pending', () => {
      store.dispatch({
        type: fetchCulturas.pending.type,
      });

      const state = store.getState().cultura;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchCulturas fulfilled', () => {
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: mockCulturas,
      });

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toEqual(mockCulturas);
      expect(state.error).toBeNull();
    });

    it('should handle fetchCulturas rejected', () => {
      const errorMessage = 'Failed to fetch culturas';
      store.dispatch({
        type: fetchCulturas.rejected.type,
        payload: errorMessage,
      });

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should fetch culturas successfully', async () => {
      mockedCulturaService.getAll.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturas());

      const state = store.getState().cultura;
      expect(state.culturas).toEqual(mockCulturas);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetchCulturas error', async () => {
      const errorMessage = 'Network error';
      mockedCulturaService.getAll.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchCulturas());

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchCulturasByPropriedade', () => {
    const propriedadeId = 'prop1';

    it('should handle fetchCulturasByPropriedade fulfilled', () => {
      store.dispatch({
        type: fetchCulturasByPropriedade.fulfilled.type,
        payload: mockCulturas,
      });

      const state = store.getState().cultura;
      expect(state.loading).toBe(false);
      expect(state.culturas).toEqual(mockCulturas);
    });

    it('should fetch culturas by propriedade successfully', async () => {
      mockedCulturaService.getByPropriedade.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturasByPropriedade(propriedadeId));

      const state = store.getState().cultura;
      expect(state.culturas).toEqual(mockCulturas);
      expect(mockedCulturaService.getByPropriedade).toHaveBeenCalledWith(propriedadeId);
    });

    it('should handle fetchCulturasByPropriedade error', async () => {
      const errorMessage = 'Failed to fetch culturas by propriedade';
      mockedCulturaService.getByPropriedade.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchCulturasByPropriedade(propriedadeId));

      const state = store.getState().cultura;
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchCulturasBySafra', () => {
    const safraId = 'safra1';

    it('should handle fetchCulturasBySafra fulfilled', () => {
      store.dispatch({
        type: fetchCulturasBySafra.fulfilled.type,
        payload: mockCulturas,
      });

      const state = store.getState().cultura;
      expect(state.culturas).toEqual(mockCulturas);
    });

    it('should fetch culturas by safra successfully', async () => {
      mockedCulturaService.getBySafra.mockResolvedValue(mockCulturas);

      await store.dispatch(fetchCulturasBySafra(safraId));

      const state = store.getState().cultura;
      expect(state.culturas).toEqual(mockCulturas);
      expect(mockedCulturaService.getBySafra).toHaveBeenCalledWith(safraId);
    });
  });

  describe('fetchCulturaById', () => {
    const culturaId = '1';

    it('should handle fetchCulturaById fulfilled', () => {
      store.dispatch({
        type: fetchCulturaById.fulfilled.type,
        payload: mockCultura,
      });

      const state = store.getState().cultura;
      expect(state.currentCultura).toEqual(mockCultura);
    });

    it('should fetch cultura by id successfully', async () => {
      mockedCulturaService.getById.mockResolvedValue(mockCultura);

      await store.dispatch(fetchCulturaById(culturaId));

      const state = store.getState().cultura;
      expect(state.currentCultura).toEqual(mockCultura);
      expect(mockedCulturaService.getById).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('createCultura', () => {
    const createData: CreateCulturaData = {
      nome: 'Nova Cultura',
      descricao: 'Descrição da nova cultura',
    };

    it('should handle createCultura fulfilled', () => {
      // First add some existing culturas
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: mockCulturas,
      });

      const newCultura = { ...mockCultura, id: '3', nome: 'Nova Cultura' };
      store.dispatch({
        type: createCultura.fulfilled.type,
        payload: newCultura,
      });

      const state = store.getState().cultura;
      expect(state.culturas).toHaveLength(3);
      expect(state.culturas[2]).toEqual(newCultura);
    });

    it('should create cultura successfully', async () => {
      const newCultura = { ...mockCultura, id: '3', nome: 'Nova Cultura' };
      mockedCulturaService.create.mockResolvedValue(newCultura);

      await store.dispatch(createCultura(createData));

      const state = store.getState().cultura;
      expect(state.culturas).toContain(newCultura);
      expect(mockedCulturaService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('updateCultura', () => {
    const updateData: UpdateCulturaData = {
      nome: 'Cultura Atualizada',
      descricao: 'Descrição atualizada',
    };

    beforeEach(() => {
      // Setup initial state with culturas
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: mockCulturas,
      });
      store.dispatch(setCurrentCultura(mockCultura));
    });

    it('should handle updateCultura fulfilled', () => {
      const updatedCultura = { ...mockCultura, nome: 'Cultura Atualizada' };
      store.dispatch({
        type: updateCultura.fulfilled.type,
        payload: updatedCultura,
      });

      const state = store.getState().cultura;
      const updatedInList = state.culturas.find(c => c.id === mockCultura.id);
      expect(updatedInList).toEqual(updatedCultura);
      expect(state.currentCultura).toEqual(updatedCultura);
    });

    it('should update cultura successfully', async () => {
      const updatedCultura = { ...mockCultura, nome: 'Cultura Atualizada' };
      mockedCulturaService.update.mockResolvedValue(updatedCultura);

      await store.dispatch(updateCultura({ id: mockCultura.id, data: updateData }));

      const state = store.getState().cultura;
      const updatedInList = state.culturas.find(c => c.id === mockCultura.id);
      expect(updatedInList).toEqual(updatedCultura);
      expect(mockedCulturaService.update).toHaveBeenCalledWith(mockCultura.id, updateData);
    });
  });

  describe('deleteCultura', () => {
    beforeEach(() => {
      // Setup initial state with culturas
      store.dispatch({
        type: fetchCulturas.fulfilled.type,
        payload: mockCulturas,
      });
      store.dispatch(setCurrentCultura(mockCultura));
    });

    it('should handle deleteCultura fulfilled', () => {
      store.dispatch({
        type: deleteCultura.fulfilled.type,
        payload: mockCultura.id,
      });

      const state = store.getState().cultura;
      expect(state.culturas).toHaveLength(1);
      expect(state.culturas.find(c => c.id === mockCultura.id)).toBeUndefined();
      expect(state.currentCultura).toBeNull();
    });

    it('should delete cultura successfully', async () => {
      mockedCulturaService.delete.mockResolvedValue(undefined);

      await store.dispatch(deleteCultura(mockCultura.id));

      const state = store.getState().cultura;
      expect(state.culturas).toHaveLength(1);
      expect(state.culturas.find(c => c.id === mockCultura.id)).toBeUndefined();
      expect(mockedCulturaService.delete).toHaveBeenCalledWith(mockCultura.id);
    });

    it('should handle deleteCultura error', async () => {
      const errorMessage = 'Failed to delete cultura';
      mockedCulturaService.delete.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(deleteCultura(mockCultura.id));

      const state = store.getState().cultura;
      expect(state.error).toBe(errorMessage);
      expect(state.culturas).toHaveLength(2); // Should not be deleted on error
    });
  });

  describe('error handling', () => {
    it('should handle async thunk errors without message', async () => {
      mockedCulturaService.getAll.mockRejectedValue({});

      await store.dispatch(fetchCulturas());

      const state = store.getState().cultura;
      expect(state.error).toBe('Erro ao buscar culturas');
    });

    it('should handle all async thunk rejections properly', async () => {
      const testCases = [
        { thunk: fetchCulturas, method: 'getAll', defaultError: 'Erro ao buscar culturas' },
        {
          thunk: fetchCulturasByPropriedade,
          method: 'getByPropriedade',
          defaultError: 'Erro ao buscar culturas da propriedade',
          arg: 'prop1',
        },
        {
          thunk: fetchCulturasBySafra,
          method: 'getBySafra',
          defaultError: 'Erro ao buscar culturas da safra',
          arg: 'safra1',
        },
        {
          thunk: fetchCulturaById,
          method: 'getById',
          defaultError: 'Erro ao buscar cultura',
          arg: '1',
        },
        {
          thunk: createCultura,
          method: 'create',
          defaultError: 'Erro ao criar cultura',
          arg: { nome: 'Test', descricao: 'Test' },
        },
        {
          thunk: updateCultura,
          method: 'update',
          defaultError: 'Erro ao atualizar cultura',
          arg: { id: '1', data: { nome: 'Test' } },
        },
        {
          thunk: deleteCultura,
          method: 'delete',
          defaultError: 'Erro ao deletar cultura',
          arg: '1',
        },
      ];

      for (const testCase of testCases) {
        // Reset state
        store.dispatch(clearError());

        // Mock the service method to reject
        (mockedCulturaService as any)[testCase.method].mockRejectedValue({});

        // Dispatch the thunk
        await store.dispatch((testCase.thunk as any)(testCase.arg));

        // Check the error
        const state = store.getState().cultura;
        expect(state.error).toBe(testCase.defaultError);
      }
    });
  });
});
