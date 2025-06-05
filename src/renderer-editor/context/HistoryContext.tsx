import { createContext } from 'react';
import { LinkedLabel } from '../../types/LinkedLabel';

const HistoryContext = createContext<{
  history: LinkedLabel[];
  pushHistory: (toAdd: LinkedLabel) => void;
  popHistory: () => void;
}>({
  history: [],
  pushHistory: () => {},
  popHistory: () => {},
});

export default HistoryContext;
