import { configureStore } from '@reduxjs/toolkit';
import culturaReducer from './culturaSlice';
import producerReducer from './producerSlice';
import propriedadeRuralReducer from './propriedadeRuralSlice';
import safraReducer from './safraSlice';

export const store = configureStore({
  reducer: {
    producers: producerReducer,
    propriedades: propriedadeRuralReducer,
    safras: safraReducer,
    culturas: culturaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
