# 🌾 Weather Alert Engine 🚨

Because rain doesn’t RSVP, but your app can.  
The Weather Alert Module is a backend submodule built for **GreenTip**, designed to fetch, process, and deliver weather-related alerts to users. Built with **Next.js**, it leverages **Firestore** for data management and **FCM** for push notifications, ensuring timely and personalized notifications for districts and farms through a modular, type-safe architecture.

---

## 🚀 What It Does

- ⛅ Fetches weather alerts from the Weather Module
- 📦 Groups alerts by district so each farmer gets what *they* need
- 👨‍🌾 Users can decide wether they *actually* want alerts (no spam, we promise)
- 📲 Delivers alerts via FCM across all user devices — fast and reliable
- 🔁 Runs periodically - 3 times a day, like a good bot should!

---

## 🛠️ Tech Stack

- **Next.js**: Server-side processing and API Routes.
- **Firebase Admin SDK**: Interacts with Firebase Services.
- **Firestore**: Manages notification data independent of user data. Only reads user data while sending.
- **FCM (Firebase Cloud Messaging)**: For reliable notification delivery.
Designed with a utility-based approach, ensuring reusable and maintainable code.

---

## 🧯To-do List

- 🌐 Multilingual support for regional languages
- 🎛 Web dashboard for admins
- 🔁 Retry logic for failed sends

**🙌 Shoutout to Soil-Weather API, Firebase, and coffee — without you, this wouldn't compile.**
