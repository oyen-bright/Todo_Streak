import { collection, doc, DocumentReference } from "firebase/firestore";
import db from "../../config/firebase";

export const createFirestoreCollection = (name: string) => {
  return collection(db, name);
};

export const getFirestoreDoc = (
  collectionName: string,
  docName: string
): DocumentReference => {
  return doc(db, collectionName, docName);
};

export const getNestedFirestoreDoc = (
  collectionName: string,
  ...docNames: string[]
): DocumentReference => {
  let ref: DocumentReference = doc(db, collectionName);
  docNames.forEach((name) => {
    ref = doc(ref, name);
  });
  return ref;
};
