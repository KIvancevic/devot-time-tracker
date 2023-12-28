import { doc, deleteDoc } from "firebase/firestore";

import { db } from "./config";

export default async function deleteData(collection: any, id: any) {
  let result = null;
  let error = null;

  try {
    result = await deleteDoc(doc(db, collection, id));
  } catch (e) {
    error = e;
  }

  return { result, error };
}
