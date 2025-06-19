import { createContext } from 'react';

const TypeChangeContext = createContext<{
  typeChanged: boolean;
}>({ typeChanged: false });

export default TypeChangeContext;
