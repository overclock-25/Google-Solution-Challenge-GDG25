import { getMessaging } from "firebase-admin/messaging";

export async function subToTopic(token, topic) {
  if (!token || !topic) {
    throw new Error("Missing token or topic");
  }
  const messaging = getMessaging();
  try {
    const response = await messaging.subscribeToTopic(token, topic);
    console.log(
      `Successfully subscribed ${token} to topic ${topic}:`,
      response
    );
    return { message: "Successfully subscribed" };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}
