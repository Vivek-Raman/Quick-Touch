import {
  Button,
  FloatingIndicator,
  Group,
  SimpleGrid,
  UnstyledButton,
} from '@mantine/core';
import { useContext, useState } from 'react';
import PouchDb from 'pouchdb-browser';
import { CENTER_INDEX } from '../../common/constants';
import Loading from '../../common/Loading';
import ShortcutPreview from './ShortcutPreview';
import PositionContext from '../context/PositionContext';
import StageContext from '../context/StageContext';
import HistoryContext from '../context/HistoryContext';
import { Stage } from '../../types/Stage';

// reference: https://mantine.dev/core/floating-indicator/#multiple-rows
export default function PositionSelector() {
  const { stage, setStage } = useContext(StageContext);
  const { position, setPosition } = useContext(PositionContext);
  const { history, popHistory } = useContext(HistoryContext);
  const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
  const [positionRefs, setPositionRefs] = useState<
    Record<number, HTMLButtonElement>
  >({});

  const goBack = async () => {
    if (history.length <= 1) return;
    const db = new PouchDb<Stage>('stage');
    const prevStageID = history[history.length - 2].id;
    const prevStage = await db.get(prevStageID);
    popHistory();
    setStage(prevStage);
  };

  const setPositionRef = (pos: number) => (node: HTMLButtonElement) => {
    positionRefs[pos] = node;
    setPositionRefs(positionRefs);
  };

  if (!stage) {
    return <Loading />;
  }
  return (
    <Group justify="center" ref={setRootRef} style={{ position: 'relative' }}>
      <FloatingIndicator
        target={positionRefs[position]}
        parent={rootRef}
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          boxShadow: 'var(--mantine-shadow-md)',
          border: '1px solid teal',
        }}
      />
      <SimpleGrid cols={3}>
        {stage.children.flatMap((child, index) => {
          const elements = [];
          if (index === CENTER_INDEX) {
            elements.push(
              <Button
                disabled={history.length <= 1}
                key="x"
                h="100%"
                w="100%"
                variant="outline"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                onClick={goBack}
              >
                Back
              </Button>,
            );
          }

          elements.push(
            <UnstyledButton
              key={child.position}
              ref={setPositionRef(child.position)}
              onClick={() => setPosition(child.position)}
              p="md"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <ShortcutPreview shortcut={child} />
            </UnstyledButton>,
          );

          return elements;
        })}
      </SimpleGrid>
    </Group>
  );
}
