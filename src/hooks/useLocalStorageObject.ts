import React from "react";
import { useState, useEffect } from "react";

const useLocalStorageObject = <T extends object>(
  key: string,
  initialValue: T
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  (key: keyof T) => void,
  (newObj: T) => void,
  () => void
] => {
  const [storedObj, setStoredObj] = useState<T>(() => {
    let storedValue;
    if (typeof window !== 'undefined') {
      storedValue = localStorage.getItem(key);
    }
    if (storedValue) {
      return JSON.parse(storedValue);
    } else {
      return initialValue;
    }
  });

  const removeItem = (itemKey: keyof T) => {
    setStoredObj((prevObj) => {
      const newObj = { ...prevObj };
      delete newObj[itemKey];
      localStorage.setItem(key, JSON.stringify(newObj));
      return newObj;
    });
  };

  const updateItem = (newObj: T) => {
    setStoredObj((prevObj) => {
      const updatedObj = { ...prevObj, ...newObj };
      localStorage.setItem(key, JSON.stringify(updatedObj));
      return updatedObj;
    });
  };

  const clearStorage = () => {
    setStoredObj(initialValue);
    localStorage.removeItem(key);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(storedObj));
    }
  }, [key, storedObj]);

  return [storedObj, setStoredObj, removeItem, updateItem, clearStorage];
};

export default useLocalStorageObject;
