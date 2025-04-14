import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PouchDb from 'pouchdb-browser';
import { StageEntity } from '../types/Stage';
import Loading from './common/Loading';

export default function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const checkFirstTimeUser = async () => {
    const db = new PouchDb<StageEntity>('stage');
    const root = await db.get('0').catch((_) => {});
    if (!root) {
      console.warn('No root element found; redirecting to onboarding.');
      await navigate('/first-launch');
    } else {
      await navigate('/');
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc--set-edit-mode', async (editMode) => {
      if (editMode) {
        await navigate('/editor');
      } else {
        await navigate('/');
      }
    });

    window.electron.ipcRenderer.on(
      'ipc--dev--flush-stage-db',
      async (flush) => {
        if (!flush) return;
        setLoading(true);
        const db = new PouchDb<StageEntity>('stage');
        await db.destroy();
        await checkFirstTimeUser();
        setLoading(false);
      },
    );

    (async () => {
      setLoading(true);
      await checkFirstTimeUser();
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loading />;
  return <>You should not be here.</>;
}
