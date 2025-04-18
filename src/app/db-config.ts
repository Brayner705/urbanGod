import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'urbanGodDB',
  version: 7,
  objectStoresMeta: [
    {
      store: 'products',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'stock', keypath: 'stock', options: { unique: false } },
        { name: 'price', keypath: 'price', options: { unique: false } },
        { name: 'imageUrl', keypath: 'imageUrl', options: { unique: false } }
      ]
    },
    {
      store: 'sales',
      storeConfig: {keyPath: 'id', autoIncrement: true},
      storeSchema: [
        { name: 'name', keypath: 'name', options: {unique: false} },
        { name: 'stock', keypath: 'stock', options: {unique: false} },
        { name: 'price', keypath: 'price', options: {unique: false}}
      ]
    },
    {
      store: 'spent',
      storeConfig: {keyPath: 'id', autoIncrement: true},
      storeSchema: [
        { name: 'name', keypath:'name', options: {unique: false}},
        { name: 'stock', keypath: 'stock', options: {unique: false}},
        { name: 'price', keypath:'price', options: {unique: false}}
      ]
    }
  ]
};
