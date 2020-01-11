import React, { useEffect } from "react";

const useMouseMoveEvent = ({ isMouse, eventAction }) => {
  // Mouse move event
  useEffect(() => {
    isMouse &&
      document.addEventListener("mousemove", eventAction("MOUSE_MOVE"));
    return () =>
      isMouse &&
      document.removeEventListener("mousemove", eventAction("MOUSE_MOVE"));
  }, [eventAction, isMouse]);
};

export default useMouseMoveEvent;
