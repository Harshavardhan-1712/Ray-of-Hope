import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic hook for API data fetching with loading/error state.
 * Falls back to `fallbackData` when the API is unavailable (offline dev).
 *
 * @param {Function} apiFn      – async function returning an axios response
 * @param {Array}    deps       – dependency array (like useEffect)
 * @param {*}        fallbackData – data to use when API fails
 */
const useApi = (apiFn, deps = [], fallbackData = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
      if (mountedRef.current) setData(response.data);
      return response.data;
    } catch (err) {
      if (mountedRef.current) {
        const msg = err.response?.data?.message || err.message || 'Something went wrong';
        setError(msg);
        // Fall back to mock data so the UI still renders during development
        if (fallbackData !== null) setData(fallbackData);
      }
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => { mountedRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: execute };
};

export default useApi;
