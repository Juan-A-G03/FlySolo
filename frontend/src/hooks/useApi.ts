import { useState, useCallback, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useApi = <T,>(
  apiFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return null;
      }
    },
    [apiFunction]
  );

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    setData,
    setError,
    reset,
  };
};