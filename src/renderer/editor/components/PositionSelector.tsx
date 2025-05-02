import {
  FloatingIndicator,
  Group,
  SimpleGrid,
  UnstyledButton,
} from '@mantine/core';
import { useState } from 'react';
import { Stage } from '../../../types/Stage';
import { CENTER_INDEX } from '../../common/constants';
import Loading from '../../common/Loading';
import ShortcutPreview from './ShortcutPreview';

interface PositionSelectorProps {
  stage: Stage | null;
  position: number;
  setPosition: (position: number) => void;
}

// reference: https://mantine.dev/core/floating-indicator/#multiple-rows
export default function PositionSelector(props: PositionSelectorProps) {
  const { stage, position, setPosition } = props;
  const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
  const [positionRefs, setPositionRefs] = useState<
    Record<number, HTMLButtonElement>
  >({});

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
              <UnstyledButton
                disabled
                p="md"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
              >
                Back
              </UnstyledButton>,
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
