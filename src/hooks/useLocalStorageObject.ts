import React, { useEffect, useState } from "react";

type LocalStorageObject<T extends { title: string }> = {
  items: { [key: string]: T };
  setItems: React.Dispatch<React.SetStateAction<{ [key: string]: T }>>;
  removeItem: (item: T) => void;
  addItem: (item: T) => void;
  addItems: (items: T[]) => void;
  updateItem: (item: T) => void;
  clearItems: () => void;
};

const useLocalStorageList = <T extends { title: string }>(
  key: string,
  initialValue: T[]
): LocalStorageObject<T> => {
  const [items, setItems] = useState<{ [key: string]: T }>(() => {
    let storedValue;
    if (typeof window !== "undefined") {
      storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      } else {
        const obj = initialValue.reduce((acc, item) => {
          acc[item.title] = item;
          return acc;
        }, {} as { [key: string]: T });
        localStorage.setItem(key, JSON.stringify(obj));
        return obj;
      }
    }
  });

  const removeItem = (item: T) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems };
      delete newItems[item.title];
      localStorage.setItem(key, JSON.stringify(newItems));
      return newItems;
    });
  };

  const addItem = (item: T) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems, [item.title]: item };
      localStorage.setItem(key, JSON.stringify(newItems));
      return newItems;
    });
  };

  const addItems = (items: T[]) => {
    setItems((prevItems) => {
      const newItems = items.reduce((acc, item) => {
        acc[item.title] = item;
        return acc;
      }, { ...prevItems });
      localStorage.setItem(key, JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateItem = (item: T) => {
    setItems((prevItems) => {
      const newItems = { ...prevItems, [item.title]: item };
      localStorage.setItem(key, JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearItems = () => {
    setItems({});
    localStorage.removeItem(key);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [key, items]);

  return {
    items,
    setItems,
    removeItem,
    addItem,
    addItems,
    updateItem,
    clearItems,
  };
};

export default useLocalStorageList;
