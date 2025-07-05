import PouchDb from 'pouchdb-browser';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigKey from '../common/enums/ConfigKey';
import Loading from '../common/Loading';
import { Config } from '../types/Config';
import { StageEntity } from '../types/Stage';

export default function App() {
  const navigate = useNavigate();

  const checkFirstTimeUser = useCallback(async () => {
    const db = new PouchDb<Config>('config');
    const root = await db.get(ConfigKey.SETUP_COMPLETE).catch(() => {});
    if (!root) {
      // No root element found; redirecting to onboarding
      await navigate('/first-launch');
    } else {
      await navigate('/root');
    }
  }, [navigate]);

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on(
      'ipc--dev--flush-db',
      async (flush) => {
        if (!flush) return;
        const stageDB = new PouchDb<StageEntity>('stage');
        await stageDB.destroy();
        const configDB = new PouchDb<Config>('config');
        await configDB.destroy();
        await checkFirstTimeUser();
      },
    );

    checkFirstTimeUser();

    return () => {
      unsub();
    };
  }, [checkFirstTimeUser]);

  return <Loading />;
}
