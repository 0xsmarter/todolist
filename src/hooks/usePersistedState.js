import { useState, useEffect, useCallback } from "react";

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or unavailable — silently ignore
    }
  }, [key, state]);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
    setState(defaultValue);
  }, [key, defaultValue]);

  return [state, setState, clear];
}
