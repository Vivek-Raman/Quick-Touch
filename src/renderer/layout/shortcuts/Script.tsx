import { ScriptShortcut } from '../../../types/Shortcut';

interface ScriptProps {
  item: ScriptShortcut;
}

export default function Script(props: ScriptProps) {
  const { item } = props;

  const execute = () => {
    // run script
  }

  return (
    <button type="button" onClick={execute}>
      {item.script}
    </button>
  );
}
