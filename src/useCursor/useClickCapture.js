import React, { useCallback, useMemo, useEffect } from "react";

function useClickCapture({ dragItemId, eventAction }) {
  const onClick = useCallback(eventAction("CLICK_CAPTURE"), [eventAction]);

  const dragElement = useMemo(
    () => dragItemId && document.getElementById(dragItemId),
    [dragItemId]
  );

  useEffect(() => {
    dragElement && dragElement.addEventListener("click", onClick);
    return () =>
      dragElement && dragElement.removeEventListener("click", onClick);
  }, [dragElement, onClick]);
}

export default useClickCapture;
