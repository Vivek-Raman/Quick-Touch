import { createContext } from 'react';

const PositionContext = createContext<{
  position: number;
  setPosition: (pos: number) => void;
}>({ position: -1, setPosition: () => {} });

export default PositionContext;
