export * from './producer';
export * from './propriedadeRural';
export * from './safra';
export * from './cultura';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
