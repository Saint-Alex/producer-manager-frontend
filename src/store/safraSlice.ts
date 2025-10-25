import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Safra, CreateSafraData } from '../types/safra';
import { safraService } from '../services/safraService';

interface SafraState {
  safras: Safra[];
  loading: boolean;
  error: string | null;
  currentSafra: Safra | null;
}

const initialState: SafraState = {
  safras: [],
  loading: false,
  error: null,
  currentSafra: null,
};

export const fetchSafras = createAsyncThunk('safras/fetchAll', async () => {
  return await safraService.getAll();
});

export const fetchSafrasByPropriedade = createAsyncThunk(
  'safras/fetchByPropriedade',
  async (propriedadeId: string) => {
    return await safraService.getByPropriedade(propriedadeId);
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
        state.error = action.error.message || 'Erro ao buscar safras';
      })
      // Fetch safras by propriedade
      .addCase(fetchSafrasByPropriedade.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSafrasByPropriedade.fulfilled, (state, action) => {
        state.loading = false;
        state.safras = action.payload;
      })
      .addCase(fetchSafrasByPropriedade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar safras';
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
      })
      .addCase(createSafra.rejected, (state, action) => {
        state.loading = false;
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
      })
      .addCase(updateSafra.rejected, (state, action) => {
        state.loading = false;
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
      })
      .addCase(deleteSafra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao deletar safra';
      });
  },
});

export const { clearError, setCurrentSafra, clearCurrentSafra } = safraSlice.actions;
export default safraSlice.reducer;
