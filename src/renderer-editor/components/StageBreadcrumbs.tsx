import { Breadcrumbs, UnstyledButton } from '@mantine/core';
import { useContext } from 'react';
import HistoryContext from '../context/HistoryContext';

export default function StageBreadcrumbs() {
  const { history, popHistory } = useContext(HistoryContext);

  const jumpToStage = (id: string, index: number) => {
    // eslint-disable-next-line no-plusplus
    for (let i = index; i < history.length; ++i) {
      if (history[i].id === id) {
        popHistory();
        break;
      }
    }
  };

  return (
    <Breadcrumbs>
      {history.map((item, index) => (
        <UnstyledButton
          key={item.id}
          onClick={() => jumpToStage(item.id, index)}
        >
          {item.label}
        </UnstyledButton>
      ))}
    </Breadcrumbs>
  );
}
