import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { producerService } from '../services/producerService';
import { CreateProducerData, Producer, UpdateProducerData } from '../types/producer';

interface ProducerState {
  producers: Producer[];
  loading: boolean;
  error: string | null;
  currentProducer: Producer | null;
}

const initialState: ProducerState = {
  producers: [],
  loading: false,
  error: null,
  currentProducer: null,
};

export const fetchProducers = createAsyncThunk(
  'producers/fetchProducers',
  async () => {
    return await producerService.getAll();
  }
);

export const fetchProducerById = createAsyncThunk(
  'producers/fetchProducerById',
  async (id: string) => {
    return await producerService.getById(id);
  }
);

export const createProducer = createAsyncThunk(
  'producers/createProducer',
  async (producerData: CreateProducerData) => {
    return await producerService.create(producerData);
  }
);

export const updateProducer = createAsyncThunk(
  'producers/updateProducer',
  async ({ id, data }: { id: string; data: UpdateProducerData }) => {
    return await producerService.update(id, data);
  }
);

export const deleteProducer = createAsyncThunk(
  'producers/deleteProducer',
  async (id: string) => {
    await producerService.delete(id);
    return id;
  }
);

const producerSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.producers.push(action.payload);
    },
    setCurrentProducer: (state, action: PayloadAction<Producer | null>) => {
      state.currentProducer = action.payload;
    },
    clearCurrentProducer: (state) => {
      state.currentProducer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.loading = false;
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar produtores';
      })
      .addCase(fetchProducerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProducer = action.payload;
      })
      .addCase(fetchProducerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar produtor';
      })
      .addCase(createProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProducer.fulfilled, (state, action) => {
        state.loading = false;
        state.producers.push(action.payload);
      })
      .addCase(createProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar produtor';
      })
      .addCase(updateProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProducer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.producers.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.producers[index] = action.payload;
        }
      })
      .addCase(updateProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar produtor';
      })
      .addCase(deleteProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProducer.fulfilled, (state, action) => {
        state.loading = false;
        state.producers = state.producers.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deleteProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao deletar produtor';
      });
  },
});

export const {
  addProducer,
  setCurrentProducer,
  clearCurrentProducer,
  clearError,
} = producerSlice.actions;
export default producerSlice.reducer;
