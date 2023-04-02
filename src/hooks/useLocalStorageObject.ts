import React, { useEffect, useState } from "react";

const useLocalStorageList = <T extends { title: string }>(
  key: string,
  initialValue: T[]
): [
    { [key: string]: T },
    React.Dispatch<React.SetStateAction<{ [key: string]: T }>>,
    (item: T) => void,
    (item: T) => void,
    (item: T[]) => void,
    (item: T) => void,
    () => void
  ] => {
  const [list, setList] = useState<{ [key: string]: T }>(() => {
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
    setList((prevList) => {
      const newList = { ...prevList };
      delete newList[item.title];
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const addItem = (item: T) => {
    setList((prevList) => {
      const newList = { ...prevList, [item.title]: item };
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const addItems = (items: T[]) => {
    setList((prevList) => {
      const newList = items.reduce((acc, item) => {
        acc[item.title] = item;
        return acc;
      }, { ...prevList });
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const updateItem = (item: T) => {
    setList((prevList) => {
      const newList = { ...prevList, [item.title]: item };
      localStorage.setItem(key, JSON.stringify(newList));
      return newList;
    });
  };

  const clearList = () => {
    setList({});
    localStorage.removeItem(key);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(list));
    }
  }, [key, list]);

  return [list, setList, removeItem, addItem, addItems, updateItem, clearList];
};

export default useLocalStorageList;
