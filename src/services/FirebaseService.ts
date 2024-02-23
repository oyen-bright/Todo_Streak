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

// Function to add a document to a Firestore collection
export const addDocument = async (
  collectionName: string,
  // Data to be added to the document
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

// Function to set data of an existing document in a Firestore collection
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

// Function to update data of an existing document in a Firestore collection
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

// Function to delete an existing document from a Firestore collection
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

// Function to get data of an existing document from a Firestore collection
export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<T> => {
  try {
    // Get the document snapshot for the specified document
    const documentSnapshot = await getDoc(
      getFirestoreDoc(collectionName, documentId)
    );
    console.log("Document get successfully");
    // Return the data of the document
    return documentSnapshot.data() as T;
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

// Function to subscribe to changes in a Firestore collection

export const subscribeToCollection = (
  collectionName: string,
  callback: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => void
): Unsubscribe => {
  try {
    // Subscribe to changes in the specified collection

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

// Function to clear specified collections from Firestore

export const clearCollections = async (...collectionNames: string[]) => {
  try {
    // Initialize a batch operation

    const batch = writeBatch(db);
    // Iterate over each specified collection

    for (const collectionName of collectionNames) {
      // Get all documents in the collection

      const querySnapshot = await getDocs(collection(db, collectionName));

      // Add delete operation for each document to the batch

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    // Commit the batch operation to delete all documents

    await batch.commit();
    console.log("Collections cleared successfully");
  } catch (error) {
    console.error("Error clearing collections: ", error);
    throw error;
  }
};

// Helper function to create a Firestore collection reference

const createFirestoreCollection = (name: string) => {
  return collection(db, name);
};

// Helper function to get a Firestore document reference

const getFirestoreDoc = (
  collectionName: string,
  docName: string
): DocumentReference => {
  return doc(db, collectionName, docName);
};
