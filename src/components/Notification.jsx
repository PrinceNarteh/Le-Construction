import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useFirebase from "../hooks/useFirebase";

function Notification() {
  const { onMessageListener, requestForToken } = useFirebase();
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {
    requestForToken();

    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });

      toast(
        <div>
          <p className="font-bold">{notification?.title}</p>
          <p>{notification?.body}</p>
        </div>
      );
    });

    return () => {
      unsubscribe.catch((err) => console.error("failed", err));
    };
  }, []);
}

export default Notification;
