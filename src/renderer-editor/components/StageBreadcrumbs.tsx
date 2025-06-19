import { Breadcrumbs, UnstyledButton } from '@mantine/core';
import { useContext } from 'react';
import PouchDb from 'pouchdb-browser';
import { HistoryContext } from '../context/HistoryContext';
import { StageContext } from '../context/StageContext';
import { Stage } from '../../types/Stage';

export default function StageBreadcrumbs() {
  const { setStage } = useContext(StageContext);
  const { history, popHistory } = useContext(HistoryContext);

  const jumpToStage = (id: string, index: number) => {
    // eslint-disable-next-line no-plusplus
    for (let i = index + 1; i < history.length; ++i) {
      popHistory();
    }
    const db = new PouchDb<Stage>('stage');
    // eslint-disable-next-line promise/catch-or-return
    db.get(id).then(setStage);
  };

  return (
    <Breadcrumbs>
      {history.map((item, index) =>
        index === history.length - 1 ? (
          <strong>{item.label}</strong>
        ) : (
          <UnstyledButton
            key={item.id}
            onClick={() => jumpToStage(item.id, index)}
          >
            {item.label}
          </UnstyledButton>
        ),
      )}
    </Breadcrumbs>
  );
}
