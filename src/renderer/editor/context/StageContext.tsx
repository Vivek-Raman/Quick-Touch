import { createContext } from 'react';
import { Stage } from '../../../types/Stage';

const StageContext = createContext<{
  stage: Stage | null;
  setStage: (newStage: Stage) => void;
}>({ stage: null, setStage: () => {} });

export default StageContext;
