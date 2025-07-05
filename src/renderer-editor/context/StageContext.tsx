import type PouchDB from 'pouchdb-browser';
import type React from 'react';
import { createContext, useMemo, useState } from 'react';
import { Stage } from '../../types/Stage';

export const StageContext = createContext<{
  stage: (Stage & PouchDB.Core.IdMeta) | null;
  setStage: (newStage: Stage & PouchDB.Core.IdMeta) => void;
}>({
  stage: null,
  setStage: () => {},
});

export function StageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStage, setCurrentStage] = useState<
    (Stage & PouchDB.Core.IdMeta) | null
  >(null);

  const contextValue = useMemo(
    () => ({ stage: currentStage, setStage: setCurrentStage }),
    [currentStage],
  );

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  );
}
