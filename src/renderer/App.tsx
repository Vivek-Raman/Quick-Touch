import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import PouchDb from 'pouchdb-browser';
import { StageEntity } from '../types/Stage';
import Loading from './common/Loading';
import { Config } from '../types/Config';
import ConfigKey from './enums/ConfigKey';

export default function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const checkFirstTimeUser = useCallback(async () => {
    const db = new PouchDb<Config>('config');
    const root = await db.get(ConfigKey.SETUP_COMPLETE).catch(() => {});
    if (!root) {
      // No root element found; redirecting to onboarding
      await navigate('/first-launch');
    } else {
      await navigate('/stage');
    }
  }, [navigate]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc--set-edit-mode', async (editMode) => {
      if (editMode) {
        await navigate('/editor/0');
      } else {
        await navigate('/');
      }
    });

    window.electron.ipcRenderer.on('ipc--dev--flush-db', async (flush) => {
      if (!flush) return;
      setLoading(true);
      const db = new PouchDb<StageEntity>('stage');
      await db.destroy();
      const configDb = new PouchDb<Config>('config');
      await configDb.destroy();
      await checkFirstTimeUser();
      setLoading(false);
    });
  }, [checkFirstTimeUser, navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await checkFirstTimeUser();
      setLoading(false);
    })();
  }, [checkFirstTimeUser]);

  if (loading) return <Loading />;
  return <>You should not be here.</>;
}
