import React, { useEffect, useCallback } from "react";

const useMouseMoveEvent = ({ isMouse, eventAction }) => {
  const onMouseMove = useCallback(eventAction("MOUSE_MOVE"), [eventAction]);
  // Mouse move event works only mouse is down
  useEffect(() => {
    isMouse && document.addEventListener("mousemove", onMouseMove);
    return () =>
      isMouse && document.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove, isMouse]);
};

export default useMouseMoveEvent;
