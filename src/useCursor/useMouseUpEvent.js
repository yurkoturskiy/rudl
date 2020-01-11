import React, { useEffect } from "react";

const useMouseUpEvent = ({ eventAction }) => {
  // Mouse up event
  useEffect(() => {
    document.addEventListener("mouseup", eventAction("MOUSE_UP"));
    return () => {
      document.removeEventListener("mouseup", eventAction("MOUSE_UP"));
    };
  }, [eventAction]);
};

export default useMouseUpEvent;
