import type PouchDB from 'pouchdb-browser';

export interface Config extends PouchDB.Core.IdMeta {
  value: string;
}

export type ConfigEntity = Config & PouchDB.Core.GetMeta;
