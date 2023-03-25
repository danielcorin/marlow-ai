import React from "react";
import { useState, useEffect } from "react";

const useLocalStorageList = <T>(key: string, initialValue: T[]): [
  T[],
  React.Dispatch<React.SetStateAction<T[]>>,
  (item: T) => void,
  (item: T) => void,
  (item: T[]) => void,
  () => void,
] => {
  const [list, setList] = useState<T[]>(() => {
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

  const removeItem = (item: T) => {
    setList((prevList) => {
      const index = prevList.indexOf(item);
      if (index !== -1) {
        const newList = [...prevList];
        newList.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(newList));
        return newList;
      } else {
        return prevList;
      }
    });
  };

  const addItem = (item: T) => {
    setList((prevList) => {
      const newList = [...prevList, item];
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const addItems = (items: T[]) => {
    setList((prevList) => {
      const newList = [...prevList, ...items];
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const clearList = () => {
    setList([]);
    localStorage.removeItem(key);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(list));
    }
  }, [key, list]);

  return [list, setList, removeItem, addItem, addItems, clearList];
};

export default useLocalStorageList;
