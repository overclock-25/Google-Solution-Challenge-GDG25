import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const storeInteractions = async (farmId, userId, dataObj) => {
  try {
    const farmRef = adminDb.collection("farms").doc(farmId);
    if (farmRef) {
      const farmData = (await farmRef.get()).data();
      console.log(farmData.userId);
      if (farmData.userId === userId) {
        await farmRef.update({
          interactions: FieldValue.arrayUnion(dataObj),
        });

        console.log(`Updated interactions in farm ${farmId}`);
        return true;
      } else {
        console.log("Unauthorized: This farm does not belong to the user.");
        return false;
      }
    } else {
      console.log("Farm not found.");
      return false;
    }
  } catch (error) {
    console.error("Error storing farm data:", error);
    return false;
  }
};
