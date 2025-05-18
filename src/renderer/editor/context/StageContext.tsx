import { createContext } from 'react';
import type PouchDB from 'pouchdb-browser';
import { Stage } from '../../../types/Stage';

const StageContext = createContext<{
  stage: (Stage & PouchDB.Core.IdMeta) | null;
  setStage: (newStage: Stage & PouchDB.Core.IdMeta) => void;
}>({
  stage: null,
  setStage: () => {},
});

export default StageContext;
