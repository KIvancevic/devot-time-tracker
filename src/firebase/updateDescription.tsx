import { doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export default async function updateDescription(
  collection: any,
  id: any,
  description: string
) {
  let result = null;
  let error = null;

  try {
    result = await updateDoc(doc(db, collection, id), {
      description: description,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
