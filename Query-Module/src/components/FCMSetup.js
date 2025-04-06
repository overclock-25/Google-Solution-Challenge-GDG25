"use client";
import useFCMToken from "@/lib/hooks/useFCMToken";

export default function FCMSetup({ userId }) {
  console.log({userId})
  useFCMToken(userId);
  return null;
}
