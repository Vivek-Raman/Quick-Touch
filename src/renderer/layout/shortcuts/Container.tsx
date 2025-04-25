import { ContainerShortcut } from '../../../types/Shortcut';

interface ContainerProps {
  item: ContainerShortcut;
  doUpdate: Function;
}

export default function Container(props: ContainerProps) {
  const { item, doUpdate } = props;
  return (
    <button type="button" onClick={() => doUpdate(item.stageId)}>
      {item.stageId}
    </button>
  );
}
