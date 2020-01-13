import React, { useState, useEffect, useCallback } from "react";

// Timeout handlers
const awaitGesture = (setAwait, action, delay) =>
  setAwait(setTimeout(action, delay));
const cancelAwait = setAwait =>
  setAwait(delay => {
    clearTimeout(delay);
    return null;
  });

function usePress({ plainAction, isTouch }) {
  // Press Gesture
  const [pressDelay, awaitPress] = useState();
  const [longPressDelay, awaitLongPress] = useState();
  // Press actions
  const onPress = useCallback(plainAction("PRESS"), [plainAction]);
  const onLongPress = useCallback(plainAction("LONG_PRESS"), [plainAction]);

  const setTimeouts = useCallback(() => {
    !pressDelay && awaitGesture(awaitPress, onPress, 300);
    !longPressDelay && awaitGesture(awaitLongPress, onLongPress, 500);
  }, [longPressDelay, onLongPress, onPress, pressDelay]);

  const clearTimeouts = useCallback(() => {
    pressDelay && cancelAwait(awaitPress);
    longPressDelay && cancelAwait(awaitLongPress);
  }, [longPressDelay, pressDelay]);
  // Set timeouts for timebased gestures
  useEffect(() => {
    isTouch && setTimeouts();
    return () => isTouch && clearTimeouts();
  }, [clearTimeouts, isTouch, setTimeouts]);
}

export default usePress;
