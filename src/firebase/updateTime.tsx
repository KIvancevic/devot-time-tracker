import { doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export default async function updateTime(
  collection: any,
  id: any,
  updatedTime: { hours: number; minutes: number; seconds: number }
) {
  let result = null;
  let error = null;

  try {
    result = await updateDoc(doc(db, collection, id), {
      timeLogged: updatedTime,
    });
  } catch (e) {
    error = e;
    console.log(e);
  }

  return { result, error };
}
