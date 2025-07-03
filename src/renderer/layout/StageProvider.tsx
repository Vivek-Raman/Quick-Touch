import { MantineTransition, SimpleGrid, Transition } from '@mantine/core';
import PouchDB from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CENTER_INDEX } from '../../common/constants';
import ShortcutType from '../../common/enums/ShortcutType';
import type {
  ContainerShortcut,
  HotkeyShortcut,
  ScriptShortcut,
  Shortcut,
} from '../../types/Shortcut';
import type { Stage, StageEntity } from '../../types/Stage';
import Back from './shortcuts/Back';
import Container from './shortcuts/Container';
import Hotkey from './shortcuts/Hotkey';
import Script from './shortcuts/Script';

// prettier-ignore
const TRANSITIONS = [
  'pop-bottom-right', 'fade-up'    , 'pop-bottom-left',
  'fade-left'       , /* 'fade', */       'fade-right',
  'pop-top-right'   , 'fade-down'  ,    'pop-top-left',
] as MantineTransition[];
const TRANSITION_DURATION = 250;
const TRANSITION_EASING = 'ease-in';

export default function StageProvider() {
  const { id: stageID } = useParams<{ id?: string }>();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadStage = async (id: string) => {
    setShortcuts([]);

    const db = new PouchDB<Stage>('stage');
    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setShortcuts(stage.children);
  };

  useEffect(() => {
    setMounted(false);

    (async () => {
      if (!stageID) return;
      await loadStage(stageID);
    })();

    setTimeout(() => {
      setMounted(true);
    }, 10);
  }, [stageID]);

  return (
    <SimpleGrid cols={3} h="100%" p="xs">
      {shortcuts.flatMap((shortcut, index) => {
        const elements = [];
        if (index === CENTER_INDEX) {
          elements.push(
            <Transition
              key="x"
              transition="fade"
              duration={TRANSITION_DURATION}
              timingFunction={TRANSITION_EASING}
              enterDelay={TRANSITION_DURATION / 3}
              mounted={mounted}
            >
              {(styles) => <Back style={styles} />}
            </Transition>,
          );
        }
        if (shortcut.type === ShortcutType.EMPTY) {
          elements.push(<div key={shortcut.position} />);
        } else if (shortcut.type === ShortcutType.CONTAINER) {
          elements.push(
            <Transition
              key={shortcut.position}
              transition={TRANSITIONS[index]}
              duration={TRANSITION_DURATION}
              timingFunction={TRANSITION_EASING}
              mounted={mounted}
            >
              {(styles) => (
                <Container
                  item={shortcut as ContainerShortcut}
                  style={styles}
                />
              )}
            </Transition>,
          );
        } else if (shortcut.type === ShortcutType.SCRIPT) {
          elements.push(
            <Transition
              key={shortcut.position}
              transition={TRANSITIONS[index]}
              duration={TRANSITION_DURATION}
              mounted={mounted}
              timingFunction={TRANSITION_EASING}
            >
              {(styles) => (
                <Script item={shortcut as ScriptShortcut} style={styles} />
              )}
            </Transition>,
          );
        } else if (shortcut.type === ShortcutType.HOTKEY) {
          elements.push(
            <Transition
              key={shortcut.position}
              transition={TRANSITIONS[index]}
              duration={TRANSITION_DURATION}
              mounted={mounted}
              timingFunction={TRANSITION_EASING}
            >
              {(styles) => (
                <Hotkey item={shortcut as HotkeyShortcut} style={styles} />
              )}
            </Transition>,
          );
        }
        return elements;
      })}
    </SimpleGrid>
  );
}
