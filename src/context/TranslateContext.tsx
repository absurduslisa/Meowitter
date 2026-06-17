'use client';
import { createContext, useContext, useState } from 'react';

type TranslateContextType = {
  translate: boolean;
  setTranslate: (val: boolean) => void;
};

const TranslateContext = createContext<TranslateContextType>({
  translate: false,
  setTranslate: () => {},
});

export function TranslateProvider({ children }: { children: React.ReactNode }) {
  const [translate, setTranslate] = useState(false);
  return (
    <TranslateContext.Provider value={{ translate, setTranslate }}>
      {children}
    </TranslateContext.Provider>
  );
}

export function useTranslate() {
  return useContext(TranslateContext);
}
