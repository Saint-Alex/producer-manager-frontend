import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Redux Hooks', () => {
  test('useAppDispatch returns dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  test('useAppSelector returns state', () => {
    const { result } = renderHook(
      () => useAppSelector((state) => state.producers),
      { wrapper }
    );
    expect(result.current).toBeDefined();
    expect(result.current.producers).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
