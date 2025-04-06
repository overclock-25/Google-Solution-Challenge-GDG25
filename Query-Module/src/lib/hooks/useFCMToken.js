"use client";
import { useEffect, useState, useRef } from "react";
import { messaging } from "@/lib/firebase/firebase-client";
import { getToken, onMessage } from "firebase/messaging";

export default function useFCMToken(userId) {
  const [status, setStatus] = useState("idle");
  const hasSavedToken = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const initFCM = async () => {
      let registration;
      try {
        if ("serviceWorker" in navigator) {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
        }

        if (Notification.permission === "granted") {
          await handleToken(registration);
        } else if (
          Notification.permission === "default"
          //&& localStorage.getItem("askedForNotification") !== "true"  //! uncomment in deployment
        ) {
          const permission = await Notification.requestPermission();
          localStorage.setItem("askedForNotification", "true");

          if (permission === "granted") {
            await handleToken(registration);
          } else {
            setStatus(permission);
          }
        } else {
          setStatus("denied");
        }
      } catch (e) {
        // console.log("Error getting notification permission", e);
        setStatus("error");
      }
    };

    const handleToken = async (registration) => {
      if (hasSavedToken.current) return;
      hasSavedToken.current = true;

      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          const savedTokenKey = `fcm_token_${userId}`;
          const savedToken = localStorage.getItem(savedTokenKey);
          console.log("fCT")
          if (token !== savedToken) {
            await fetch("/api/save-fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, token }),
            });

            localStorage.setItem(savedTokenKey, token);
          }
          setStatus("granted");
        }
      } catch (err) {
        console.log("Failed to get or save FCM token:", err);
        setStatus("error");
      }
    };

    initFCM();

    const unsubscribeMessage = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const { title, body } = payload.notification || {};
      if (title && body) {
        new Notification(title, { body });
      }
    });

    return () => {
      unsubscribeMessage();
    };
  }, [userId]);

  return status;
}
