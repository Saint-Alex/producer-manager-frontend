import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { safraService } from '../services/safraService';
import { CreateSafraData, Safra } from '../types/safra';

interface SafraState {
  safras: Safra[];
  loading: boolean;
  error: string | null;
  currentSafra: Safra | null;
  safrasByPropriedade: Record<string, Safra[]>; // Cache de safras por propriedade (array)
}

const initialState: SafraState = {
  safras: [],
  loading: false,
  error: null,
  currentSafra: null,
  safrasByPropriedade: {},
};

export const fetchSafras = createAsyncThunk('safras/fetchAll', async () => {
  return await safraService.getAll();
});

export const fetchSafrasByPropriedade = createAsyncThunk(
  'safras/fetchByPropriedade',
  async (propriedadeId: string) => {
    const safras = await safraService.getByPropriedade(propriedadeId);
    return { propriedadeId, safras };
  }
);

export const fetchSafraById = createAsyncThunk('safras/fetchById', async (id: string) => {
  return await safraService.getById(id);
});

export const createSafra = createAsyncThunk('safras/create', async (safraData: CreateSafraData) => {
  return await safraService.create(safraData);
});

export const updateSafra = createAsyncThunk(
  'safras/update',
  async ({ id, data }: { id: string; data: Partial<CreateSafraData> }) => {
    return await safraService.update(id, data);
  }
);

export const deleteSafra = createAsyncThunk('safras/delete', async (id: string) => {
  await safraService.delete(id);
  return id;
});

const safraSlice = createSlice({
  name: 'safras',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setCurrentSafra: (state, action: PayloadAction<Safra | null>) => {
      state.currentSafra = action.payload;
    },
    clearCurrentSafra: state => {
      state.currentSafra = null;
    },
    clearSafrasByPropriedade: state => {
      state.safrasByPropriedade = {};
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all safras
      .addCase(fetchSafras.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSafras.fulfilled, (state, action) => {
        state.loading = false;
        state.safras = action.payload;
      })
      .addCase(fetchSafras.rejected, (state, action) => {
        state.loading = false;
        /* istanbul ignore next */
        state.error = action.error.message || 'Erro ao buscar safras';
      })
      // Fetch safras by propriedade
      .addCase(fetchSafrasByPropriedade.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSafrasByPropriedade.fulfilled, (state, action) => {
        state.loading = false;
        const { propriedadeId, safras } = action.payload;
        if (!state.safrasByPropriedade) {
          state.safrasByPropriedade = {};
        }
        state.safrasByPropriedade[propriedadeId] = safras;
      })
      .addCase(fetchSafrasByPropriedade.rejected, (state, action) => {
        state.loading = false;
        /* istanbul ignore next */
        state.error = action.error.message || 'Erro ao buscar safra da propriedade';
      })
      // Fetch safra by id
      .addCase(fetchSafraById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSafraById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSafra = action.payload;
      })
      .addCase(fetchSafraById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar safra';
      })
      // Create safra
      .addCase(createSafra.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSafra.fulfilled, (state, action) => {
        state.loading = false;
        state.safras.push(action.payload);
        // Atualizar o cache safrasByPropriedade se a safra tem propriedadeRural
        if (action.payload.propriedadeRural?.id) {
          if (!state.safrasByPropriedade) {
            /* istanbul ignore next */
            state.safrasByPropriedade = {};
          }
          const propriedadeId = action.payload.propriedadeRural.id;
          if (!state.safrasByPropriedade[propriedadeId]) {
            /* istanbul ignore next */
            state.safrasByPropriedade[propriedadeId] = [];
          }
          state.safrasByPropriedade[propriedadeId].push(action.payload);
        }
      })
      .addCase(createSafra.rejected, (state, action) => {
        state.loading = false;
        /* istanbul ignore next */
        state.error = action.error.message || 'Erro ao criar safra';
      })
      // Update safra
      .addCase(updateSafra.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSafra.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.safras.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.safras[index] = action.payload;
        }
        if (state.currentSafra?.id === action.payload.id) {
          state.currentSafra = action.payload;
        }
        // Atualizar o cache safrasByPropriedade se a safra tem propriedadeRural
        if (action.payload.propriedadeRural?.id) {
          if (!state.safrasByPropriedade) {
            /* istanbul ignore next */
            state.safrasByPropriedade = {};
          }
          const propriedadeId = action.payload.propriedadeRural.id;
          if (!state.safrasByPropriedade[propriedadeId]) {
            /* istanbul ignore next */
            state.safrasByPropriedade[propriedadeId] = [];
          }
          // Atualizar a safra existente no array ou adicionar se não existir
          const safraIndex = state.safrasByPropriedade[propriedadeId].findIndex(
            s => s.id === action.payload.id
          );
          if (safraIndex !== -1) {
            state.safrasByPropriedade[propriedadeId][safraIndex] = action.payload;
          } else {
            /* istanbul ignore next */
            state.safrasByPropriedade[propriedadeId].push(action.payload);
          }
        }
      })
      .addCase(updateSafra.rejected, (state, action) => {
        state.loading = false;
        /* istanbul ignore next */
        state.error = action.error.message || 'Erro ao atualizar safra';
      })
      // Delete safra
      .addCase(deleteSafra.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSafra.fulfilled, (state, action) => {
        state.loading = false;
        state.safras = state.safras.filter(s => s.id !== action.payload);
        if (state.currentSafra?.id === action.payload) {
          state.currentSafra = null;
        }
        // Remover a safra do cache de safrasByPropriedade
        Object.keys(state.safrasByPropriedade).forEach(propriedadeId => {
          state.safrasByPropriedade[propriedadeId] = state.safrasByPropriedade[
            propriedadeId
          ].filter(safra => safra.id !== action.payload);
        });
      })
      .addCase(deleteSafra.rejected, (state, action) => {
        state.loading = false;
        /* istanbul ignore next */
        state.error = action.error.message || 'Erro ao deletar safra';
      });
  },
});

export const { clearError, setCurrentSafra, clearCurrentSafra, clearSafrasByPropriedade } =
  safraSlice.actions;
export default safraSlice.reducer;
