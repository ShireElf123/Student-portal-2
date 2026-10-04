/**
 * Parent & Tutor Custom Storybook Voice Recording Storage.
 * Uses browser IndexedDB to safely persist real voice recordings for any story page,
 * allowing young learners to hear Mom, Dad, or Teacher reading their books!
 */

const DB_NAME = "my_student_portal_audio_v1";
const DB_VERSION = 1;
const STORE_NAME = "page_audio_recordings";

export interface PageAudioRecord {
  key: string; // e.g. "safari-alphabet-1"
  bookId: string;
  pageNumber: number;
  audioBlob: Blob;
  createdAt: number;
  durationSeconds?: number;
  recordedBy?: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function savePageAudio(
  bookId: string,
  pageNumber: number,
  audioBlob: Blob,
  recordedBy = "Parent"
): Promise<void> {
  try {
    const db = await getDB();
    const key = `${bookId}-${pageNumber}`;
    const record: PageAudioRecord = {
      key,
      bookId,
      pageNumber,
      audioBlob,
      createdAt: Date.now(),
      recordedBy,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to save parent audio recording:", err);
  }
}

export async function getPageAudio(
  bookId: string,
  pageNumber: number
): Promise<PageAudioRecord | null> {
  try {
    const db = await getDB();
    const key = `${bookId}-${pageNumber}`;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deletePageAudio(
  bookId: string,
  pageNumber: number
): Promise<void> {
  try {
    const db = await getDB();
    const key = `${bookId}-${pageNumber}`;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to delete audio recording:", err);
  }
}
