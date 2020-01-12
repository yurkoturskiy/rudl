import React, { useEffect, useCallback } from "react";

const useMouseUpEvent = ({ eventAction }) => {
  const onMouseUp = useCallback(eventAction("MOUSE_UP"), [eventAction]);
  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);
};

export default useMouseUpEvent;
