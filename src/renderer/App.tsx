import { useNavigate } from 'react-router-dom';
import { Suspense, useCallback, useEffect } from 'react';
import PouchDb from 'pouchdb-browser';
import { StageEntity } from '../types/Stage';
import Loading from '../common/Loading';
import { Config } from '../types/Config';
import ConfigKey from '../common/enums/ConfigKey';

export default function App() {
  const navigate = useNavigate();

  const checkFirstTimeUser = useCallback(async () => {
    const db = new PouchDb<Config>('config');
    const root = await db.get(ConfigKey.SETUP_COMPLETE).catch(() => {});
    if (!root) {
      // No root element found; redirecting to onboarding
      await navigate('/first-launch');
    } else {
      await navigate('/stage/0');
    }
  }, [navigate]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc--dev--flush-db', async (flush) => {
      if (!flush) return;
      const stageDB = new PouchDb<StageEntity>('stage');
      await stageDB.destroy();
      const configDB = new PouchDb<Config>('config');
      await configDB.destroy();
      await checkFirstTimeUser();
    });

    checkFirstTimeUser();
  }, [checkFirstTimeUser]);

  return (
    <Suspense fallback={<Loading />}>
      <div>You should not be here.</div>
    </Suspense>
  );
}
