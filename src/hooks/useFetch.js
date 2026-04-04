import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @param {Function} fetchFn  - Async function that returns { data } or { data, pagination }
 * @param {Array}    deps     - Dependency array; refetch triggers when any dep changes
 * @param {boolean}  skip     - Set true to skip the initial fetch (manual-trigger mode)
 */
const useFetch = (fetchFn, deps = [], skip = false) => {
  const [data,       setData]       = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(!skip);
  const [error,      setError]      = useState(null);

  // Use ref to always have latest fetchFn without adding it to deps
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFnRef.current();
      setData(res.data ?? res);                          // handle both shapes
      if (res.pagination) setPagination(res.pagination); // store pagination meta
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!skip) execute();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, pagination, loading, error, refetch: execute };
};

export default useFetch;
