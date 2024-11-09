import { useEffect, useRef } from "react";

const useClickOutside = (fn) => {
  const ref = useRef(null);

  useEffect(() => {
    let handler = (e) => {
      if (!ref?.current?.contains(e.target)) {
        fn();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [fn]);

  return ref;
};

export default useClickOutside;
