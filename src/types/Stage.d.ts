import type PouchDB from 'pouchdb-browser';
import { Shortcut } from './Shortcut';

export interface Stage {
  parentID: string;
  name: string;
  children: Shortcut[];
}

export type StageEntity = Stage & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;
