importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBUcz9r1alpyBlntHKyRjeuv2ctXmMx3-0",
    authDomain: "green-tip-d574c.firebaseapp.com",
    projectId: "green-tip-d574c",
    storageBucket: "green-tip-d574c.firebasestorage.app",
    messagingSenderId: "142360215816",
    appId: "1:142360215816:web:470b6a7d8f56ef1b992cbd",
    measurementId: "G-JD2445HZYX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.png"
  });
});
