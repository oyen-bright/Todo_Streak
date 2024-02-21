import {
  addDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  deleteDoc,
  collection,
  doc,
  writeBatch,
  getDocs,
  getDoc,
  setDoc,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import db from "../config/firebase";

export const addDocument = async (
  collectionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<DocumentReference<DocumentData, DocumentData>> => {
  try {
    const docRef = await addDoc(
      createFirestoreCollection(collectionName),
      data
    );
    console.log("Document added successfully");
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const setDocument = async (
  collectionName: string,
  documentId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  try {
    await setDoc(getFirestoreDoc(collectionName, documentId), data);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  documentId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  try {
    await updateDoc(getFirestoreDoc(collectionName, documentId), data);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  documentId: string
) => {
  try {
    await deleteDoc(getFirestoreDoc(collectionName, documentId));
    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<T> => {
  try {
    const documentSnapshot = await getDoc(
      getFirestoreDoc(collectionName, documentId)
    );
    console.log("Document get successfully");

    return documentSnapshot.data() as T;
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const subscribeToCollection = (
  collectionName: string,
  callback: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => void
): Unsubscribe => {
  try {
    const unsubscribe = onSnapshot(
      createFirestoreCollection(collectionName),
      (snapshot) => {
        callback(snapshot);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to collection: ", error);
    throw error;
  }
};

export const clearCollections = async (...collectionNames: string[]) => {
  try {
    const batch = writeBatch(db);

    for (const collectionName of collectionNames) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    await batch.commit();
    console.log("Collections cleared successfully");
  } catch (error) {
    console.error("Error clearing collections: ", error);
    throw error;
  }
};

const createFirestoreCollection = (name: string) => {
  return collection(db, name);
};

const getFirestoreDoc = (
  collectionName: string,
  docName: string
): DocumentReference => {
  return doc(db, collectionName, docName);
};
