/* eslint-disable react/require-default-props */
import { MantineTransition, Transition } from '@mantine/core';
import ShortcutType from '../../common/enums/ShortcutType';
import {
  ContainerShortcut,
  HotkeyShortcut,
  ScriptShortcut,
  Shortcut,
} from '../../types/Shortcut';
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

export default function ShortcutItem({
  shortcut,
  mounted,
}: {
  shortcut?: Shortcut;
  mounted: boolean;
}) {
  if (!shortcut) return <div />;

  return (
    <Transition
      key={shortcut.position}
      transition={TRANSITIONS[shortcut.position]}
      duration={TRANSITION_DURATION}
      timingFunction={TRANSITION_EASING}
      mounted={mounted}
    >
      {(styles) => {
        switch (shortcut.type) {
          case ShortcutType.CONTAINER:
            return (
              <Container
                key={shortcut.position}
                item={shortcut as ContainerShortcut}
                style={styles}
              />
            );
          case ShortcutType.SCRIPT:
            return (
              <Script
                key={shortcut.position}
                item={shortcut as ScriptShortcut}
                style={styles}
              />
            );
          case ShortcutType.HOTKEY:
            return (
              <Hotkey
                key={shortcut.position}
                item={shortcut as HotkeyShortcut}
                style={styles}
              />
            );
          case ShortcutType.EMPTY:
          default:
            return (
              <div
                key={shortcut.position}
                style={{
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                &nbsp;
              </div>
            );
        }
      }}
    </Transition>
  );
}
