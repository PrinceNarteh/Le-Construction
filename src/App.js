import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import AppRoutes from "./Routes";
import { setFCMToken } from "./app/feature/user/userSlice";
import Notification from "./components/Notification";
import useTheme from "./hooks/useTheme.js";
import { FCM_Token } from "./utils/firebase";

function App() {
  const { setTheme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    setTheme();
  });

  useEffect(() => {
    if (FCM_Token) {
      console.log({ FCM_Token });
      dispatch(setFCMToken(FCM_Token));
    }
  }, [FCM_Token]);

  return (
    <>
      <AppRoutes />
      <Toaster />
      <Notification />
    </>
  );
}

export default App;
