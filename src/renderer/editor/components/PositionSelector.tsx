import {
  FloatingIndicator,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useState } from 'react';
import { Stage } from '../../../types/Stage';
import ShortcutType from '../../enums/ShortcutType';
import { CENTER_INDEX } from '../../common/constants';
import Loading from '../../common/Loading';

interface PositionSelectorProps {
  stage: Stage | undefined;
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
          border: '1px solid white',
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
              disabled={child.type !== ShortcutType.EMPTY}
              p="md"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <Text truncate="end">{child.type}</Text>
            </UnstyledButton>,
          );

          return elements;
        })}
      </SimpleGrid>
    </Group>
  );
}
