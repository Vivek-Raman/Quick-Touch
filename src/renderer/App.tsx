import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PouchDb from 'pouchdb-browser';
import { StageEntity } from '../types/Stage';

export default function App() {
  const navigate = useNavigate();

  const checkFirstTimeUser = async () => {
    const db = new PouchDb<StageEntity>('stage');
    const root = await db.get('0').catch((_) => {});
    if (!root) {
      console.warn('No root element found; redirecting to onboarding.');
      navigate('/first-time');
    }
  };

  useEffect(() => {
    (async () => {
      await checkFirstTimeUser();
    })();
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc--set-edit-mode', (editMode) => {
      if (editMode) {
        navigate('/editor');
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return <Navigate to="/stage" replace />;
}
