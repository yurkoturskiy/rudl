import React, { useEffect, useCallback } from "react";

function useDocumentEvents({ isTouch, isMouse, eventAction }) {
  const onMouseMove = useCallback(eventAction("MOUSE_MOVE"), [eventAction]);
  const onMouseUp = useCallback(eventAction("MOUSE_UP"), [eventAction]);
  const onTouchMove = useCallback(eventAction("TOUCH_MOVE"), [eventAction]);
  // Mouse move event works only mouse is down
  useEffect(() => {
    isMouse && document.addEventListener("mousemove", onMouseMove);
    isMouse && document.addEventListener("mouseup", onMouseUp);
    isTouch && document.addEventListener("touchmove", onTouchMove);
    return () => {
      isMouse && document.removeEventListener("mousemove", onMouseMove);
      isMouse && document.removeEventListener("mouseup", onMouseUp);
      isTouch && document.removeEventListener("touchmove", onTouchMove);
    };
  }, [onMouseMove, isMouse, onMouseUp, isTouch, onTouchMove]);
}

export default useDocumentEvents;
