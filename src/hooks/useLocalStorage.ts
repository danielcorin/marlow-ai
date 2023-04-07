import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: string): [string, (value: string) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? item : initialValue;
      }
      return initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, storedValue);
      }
    } catch (error) {
    }
  }, [key, storedValue]);

  const setValue = (value: string) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
