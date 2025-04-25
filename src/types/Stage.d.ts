import type PouchDB from 'pouchdb-browser';
import { Shortcut } from './Shortcut';

export interface Stage {
  name: string;
  children: Shortcut[];
}

export type StageEntity = Stage & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;
