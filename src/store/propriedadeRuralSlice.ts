import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { propriedadeRuralService } from '../services/propriedadeRuralService';
import {
    PropriedadeRural,
    PropriedadeRuralFormData,
} from '../types/propriedadeRural';

interface PropriedadeRuralState {
  propriedades: PropriedadeRural[];
  currentPropriedade: PropriedadeRural | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropriedadeRuralState = {
  propriedades: [],
  currentPropriedade: null,
  loading: false,
  error: null,
};

export const fetchPropriedades = createAsyncThunk(
  'propriedades/fetchPropriedades',
  async () => {
    const propriedades = await propriedadeRuralService.getAll();
    return propriedades;
  }
);

export const fetchPropriedadesByProdutor = createAsyncThunk(
  'propriedades/fetchPropriedadesByProdutor',
  async (produtorId: string) => {
    const propriedades = await propriedadeRuralService.getByProdutor(
      produtorId
    );
    return propriedades;
  }
);

export const fetchPropriedadeById = createAsyncThunk(
  'propriedades/fetchPropriedadeById',
  async (id: string) => {
    const propriedade = await propriedadeRuralService.getById(id);
    return propriedade;
  }
);

export const createPropriedade = createAsyncThunk(
  'propriedades/createPropriedade',
  async (data: PropriedadeRuralFormData & { produtorId: string }) => {
    // Converter FormData para CreateData
    const createData = propriedadeRuralService.convertFormToCreateData(data, [data.produtorId]);
    const propriedade = await propriedadeRuralService.create(createData);
    return propriedade;
  }
);

export const updatePropriedade = createAsyncThunk(
  'propriedades/updatePropriedade',
  async ({ id, data }: { id: string; data: PropriedadeRuralFormData }) => {
    // Converter FormData para UpdateData
    const updateData = {
      nomeFazenda: data.nomeFazenda,
      cidade: data.cidade,
      estado: data.estado,
      areaTotal: Number(data.areaTotal),
      areaAgricultavel: Number(data.areaAgricultavel),
      areaVegetacao: Number(data.areaVegetacao),
    };
    const propriedade = await propriedadeRuralService.update(id, updateData);
    return propriedade;
  }
);

export const deletePropriedade = createAsyncThunk(
  'propriedades/deletePropriedade',
  async (id: string) => {
    await propriedadeRuralService.delete(id);
    return id;
  }
);

const propriedadeRuralSlice = createSlice({
  name: 'propriedades',
  initialState,
  reducers: {
    setCurrentPropriedade: (state, action) => {
      state.currentPropriedade = action.payload;
    },
    clearCurrentPropriedade: (state) => {
      state.currentPropriedade = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all propriedades
      .addCase(fetchPropriedades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropriedades.fulfilled, (state, action) => {
        state.loading = false;
        state.propriedades = action.payload;
      })
      .addCase(fetchPropriedades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar propriedades';
      })
      // Fetch propriedades by produtor
      .addCase(fetchPropriedadesByProdutor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropriedadesByProdutor.fulfilled, (state, action) => {
        state.loading = false;
        state.propriedades = action.payload;
      })
      .addCase(fetchPropriedadesByProdutor.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao buscar propriedades do produtor';
      })
      // Fetch propriedade by id
      .addCase(fetchPropriedadeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropriedadeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPropriedade = action.payload;
      })
      .addCase(fetchPropriedadeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar propriedade';
      })
      // Create propriedade
      .addCase(createPropriedade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPropriedade.fulfilled, (state, action) => {
        state.loading = false;
        state.propriedades.push(action.payload);
      })
      .addCase(createPropriedade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar propriedade';
      })
      // Update propriedade
      .addCase(updatePropriedade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePropriedade.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.propriedades.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.propriedades[index] = action.payload;
        }
        if (state.currentPropriedade?.id === action.payload.id) {
          state.currentPropriedade = action.payload;
        }
      })
      .addCase(updatePropriedade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar propriedade';
      })
      // Delete propriedade
      .addCase(deletePropriedade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropriedade.fulfilled, (state, action) => {
        state.loading = false;
        state.propriedades = state.propriedades.filter(
          (p) => p.id !== action.payload
        );
        if (state.currentPropriedade?.id === action.payload) {
          state.currentPropriedade = null;
        }
      })
      .addCase(deletePropriedade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao deletar propriedade';
      });
  },
});

export const { setCurrentPropriedade, clearCurrentPropriedade, clearError } =
  propriedadeRuralSlice.actions;
export default propriedadeRuralSlice.reducer;
