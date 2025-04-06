import { adminDb } from "@/lib/firebase/firebase-admin";

export const getLocationFromDB = async (userId, farmId) => {
  const farmDoc = await adminDb.collection("farms").doc(farmId).get();
  if (farmDoc.exists) {
    const farmData = farmDoc.data();

    if (farmData.userId === userId) {
      const obj = {
        lat: farmData.location.latitude,
        lon: farmData.location.longitude,
        water_source_type: farmData.waterSource,
      };
      // console.log(obj);
      return obj;
    } else {
      console.log("Unauthorized: This farm does not belong to the user.");
      return null;
    }
  } else {
    console.log("Farm not found.");
    return null;
  }
};
