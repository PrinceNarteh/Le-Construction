// /* eslint-disable no-undef */
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "AIzaSyBsRfGXIPFvNSuHlEtcYtKOVHGzGeq6124",
//   authDomain: "lemarini-construction-387901.firebaseapp.com",
//   projectId: "lemarini-construction-387901",
//   storageBucket: "lemarini-construction-387901.appspot.com",
//   messagingSenderId: "564946522927",
//   appId: "1:564946522927:web:d2018682b60fac561647da",
//   measurementId: "G-1CSHE7YL8C",
// };

// const app = firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging(app);

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   window.self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });

// // Handle notification clicks
// window.self.addEventListener("notificationclick", (event) => {
//   const clickedNotification = event.notification;
//   clickedNotification.close();

//   // Handle the action associated with the notification
//   // For example, you could navigate to a specific page
//   // based on the notification's payload or open a new window.
//   // self.clients.openWindow('https://your-website.com');
// });
