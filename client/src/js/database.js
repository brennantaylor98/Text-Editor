import { openDB } from 'idb';

const dbName = 'jate';
const dbVersion = 1;
const dbStoreName = 'jate';

async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(dbStoreName)) {
        const store = db.createObjectStore(dbStoreName, { keyPath: 'id', autoIncrement: true });
        console.log(`${dbStoreName} store created with keyPath: ${store.keyPath}`);
      }
    },
  });
  console.log(`Database ${db.name} (v${db.version}) initialized`);
  return db;
}

async function putToDB(content) {
  console.log(`Adding ${content} to the ${dbStoreName} store...`);
  const db = await initDB();
  const tx = db.transaction(dbStoreName, 'readwrite');
  const store = tx.objectStore(dbStoreName);
  const request = store.put({ value: content });
  await tx.complete;
  console.log('Data added to the database!');
}

async function getFromDB() {
  console.log(`Retrieving data from the ${dbStoreName} store...`);
  const db = await initDB();
  const tx = db.transaction(dbStoreName, 'readonly');
  const store = tx.objectStore(dbStoreName);
  const request = store.get(1);
  const result = await request;
  console.log(`Data retrieved: ${result?.value}`);
  return result?.value;
}

(async () => {
  await initDB();
  await putToDB('Hello, JATE!');
  await getFromDB();
})();