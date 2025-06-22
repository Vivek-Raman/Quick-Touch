import { useNavigate } from 'react-router-dom';
import { ContainerShortcut } from '../../../types/Shortcut';

interface ContainerProps {
  item: ContainerShortcut;
}

export default function Container(props: ContainerProps) {
  const { item } = props;
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate(`/stage/${item.stageID}`);
      }}
    >
      {item.stageID}
    </button>
  );
}
