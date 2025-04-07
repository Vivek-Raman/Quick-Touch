import { ContainerItem, Item } from '../../../types/Item';

interface ContainerProps {
  item: ContainerItem;
  doUpdate: Function;
}

export default function Container(props: ContainerProps) {
  const { item, doUpdate } = props;
  return (
    <>
      <button onClick={() => doUpdate(item.stageId)}>{item.stageId}</button>
    </>
  );
}
