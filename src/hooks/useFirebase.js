import { getMessaging, getToken, onMessage } from "firebase/messaging";

const useFirebase = () => {
  const messaging = getMessaging();

  const requestForToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });

        if (currentToken) {
          return currentToken;
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
          return null;
        }
      } catch (err) {
        console.log("An error occurred while retrieving token. ", err);
        return err;
      }
    }
  };

  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
  const onMessageListener = () =>
    new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });

  return {
    onMessageListener,
    requestForToken,
  };
};

export default useFirebase;
