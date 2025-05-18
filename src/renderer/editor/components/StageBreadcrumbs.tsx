import { Breadcrumbs, UnstyledButton } from '@mantine/core';
import { useContext } from 'react';
import HistoryContext from '../context/HistoryContext';

export default function StageBreadcrumbs() {
  const { history, popHistory } = useContext(HistoryContext);

  const jumpToStage = (id: string) => {
    // eslint-disable-next-line no-plusplus
    for (let i = history.length - 1; i >= 0; --i) {
      if (history[i].id === id) {
        popHistory();
        break;
      }
    }
  };

  return (
    <Breadcrumbs>
      {history.map((item) => (
        <UnstyledButton key={item.id} onClick={jumpToStage}>
          {item.label}
        </UnstyledButton>
      ))}
    </Breadcrumbs>
  );
}
