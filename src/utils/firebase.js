import { initializeApp } from "firebase/app";

var firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,

  apiKey: "AIzaSyBsRfGXIPFvNSuHlEtcYtKOVHGzGeq6124",
  appId: "1:564946522927:web:d2018682b60fac561647da",
  authDomain: "lemarini-construction-387901.firebaseapp.com",
  measurementId: "G-1CSHE7YL8C",
  messagingSenderId: "564946522927",
  projectId: "lemarini-construction-387901",
  storageBucket: "lemarini-construction-387901.appspot.com",
};

export let FCM_Token = null;

initializeApp(firebaseConfig);

// export const requestForToken = () => {
//   console.log("Notification request");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");

//       return getToken(messaging, {
//         vapidKey: process.env.REACT_APP_VAPID_KEY,
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             console.log("current token for client: ", currentToken);
//             FCM_Token = currentToken;
//             return currentToken;
//           } else {
//             console.log(
//               "No registration token available. Request permission to generate one."
//             );
//             return null;
//           }
//         })
//         .catch((err) => {
//           console.log("An error occurred while retrieving token. ", err);
//           return err;
//         });
//     }
//   });
// };

// requestForToken();

// // Handle incoming messages. Called when:
// // - a message is received while the app has focus
// // - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
