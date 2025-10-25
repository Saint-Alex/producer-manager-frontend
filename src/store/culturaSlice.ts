import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { culturaService } from '../services/culturaService';
import { CreateCulturaData, Cultura, UpdateCulturaData } from '../types/cultura';

interface CulturaState {
  culturas: Cultura[];
  loading: boolean;
  error: string | null;
  currentCultura: Cultura | null;
}

const initialState: CulturaState = {
  culturas: [],
  loading: false,
  error: null,
  currentCultura: null,
};

// Async Thunks
export const fetchCulturas = createAsyncThunk(
  'cultura/fetchCulturas',
  async (_, { rejectWithValue }) => {
    try {
      const culturas = await culturaService.getAll();
      return culturas;
    } catch (error) {
      return rejectWithValue('Erro ao buscar culturas');
    }
  }
);

export const fetchCulturasByPropriedade = createAsyncThunk(
  'cultura/fetchCulturasByPropriedade',
  async (propriedadeRuralId: string, { rejectWithValue }) => {
    try {
      const culturas = await culturaService.getByPropriedade(propriedadeRuralId);
      return culturas;
    } catch (error) {
      return rejectWithValue('Erro ao buscar culturas da propriedade');
    }
  }
);

export const fetchCulturasBySafra = createAsyncThunk(
  'cultura/fetchCulturasBySafra',
  async (safraId: string, { rejectWithValue }) => {
    try {
      const culturas = await culturaService.getBySafra(safraId);
      return culturas;
    } catch (error) {
      return rejectWithValue('Erro ao buscar culturas da safra');
    }
  }
);

export const fetchCulturaById = createAsyncThunk(
  'cultura/fetchCulturaById',
  async (id: string, { rejectWithValue }) => {
    try {
      const cultura = await culturaService.getById(id);
      return cultura;
    } catch (error) {
      return rejectWithValue('Erro ao buscar cultura');
    }
  }
);

export const createCultura = createAsyncThunk(
  'cultura/createCultura',
  async (data: CreateCulturaData, { rejectWithValue }) => {
    try {
      const cultura = await culturaService.create(data);
      return cultura;
    } catch (error) {
      return rejectWithValue('Erro ao criar cultura');
    }
  }
);

export const updateCultura = createAsyncThunk(
  'cultura/updateCultura',
  async ({ id, data }: { id: string; data: UpdateCulturaData }, { rejectWithValue }) => {
    try {
      const cultura = await culturaService.update(id, data);
      return cultura;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar cultura');
    }
  }
);

export const deleteCultura = createAsyncThunk(
  'cultura/deleteCultura',
  async (id: string, { rejectWithValue }) => {
    try {
      await culturaService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue('Erro ao deletar cultura');
    }
  }
);

// Slice
const culturaSlice = createSlice({
  name: 'cultura',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCultura: (state) => {
      state.currentCultura = null;
    },
    setCurrentCultura: (state, action: PayloadAction<Cultura>) => {
      state.currentCultura = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all culturas
      .addCase(fetchCulturas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCulturas.fulfilled, (state, action) => {
        state.loading = false;
        state.culturas = action.payload;
      })
      .addCase(fetchCulturas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch culturas by propriedade
      .addCase(fetchCulturasByPropriedade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCulturasByPropriedade.fulfilled, (state, action) => {
        state.loading = false;
        state.culturas = action.payload;
      })
      .addCase(fetchCulturasByPropriedade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch culturas by safra
      .addCase(fetchCulturasBySafra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCulturasBySafra.fulfilled, (state, action) => {
        state.loading = false;
        state.culturas = action.payload;
      })
      .addCase(fetchCulturasBySafra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch cultura by id
      .addCase(fetchCulturaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCulturaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCultura = action.payload;
      })
      .addCase(fetchCulturaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create cultura
      .addCase(createCultura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCultura.fulfilled, (state, action) => {
        state.loading = false;
        state.culturas.push(action.payload);
      })
      .addCase(createCultura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update cultura
      .addCase(updateCultura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCultura.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.culturas.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.culturas[index] = action.payload;
        }
        if (state.currentCultura?.id === action.payload.id) {
          state.currentCultura = action.payload;
        }
      })
      .addCase(updateCultura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete cultura
      .addCase(deleteCultura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCultura.fulfilled, (state, action) => {
        state.loading = false;
        state.culturas = state.culturas.filter(c => c.id !== action.payload);
        if (state.currentCultura?.id === action.payload) {
          state.currentCultura = null;
        }
      })
      .addCase(deleteCultura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCultura, setCurrentCultura } = culturaSlice.actions;
export default culturaSlice.reducer;
