/*
 * useBody hook toggle scroll and pull-down-to-refresh
 * for touch screens when drag is enabled
 */
import React, { useReducer, useEffect, useCallback } from "react";
import logger from "../utils/logger";

const { log } = logger("useBody");

const initState = ({ state } = {}) => ({
  ...state,
  pressMode: false,
  defaultOverflow: document.body.style.overflow,
  defaultOverscrollBehaviorY: document.body.style.overscrollBehaviorY
});

const handlePress = state => {
  // Disable scroll and pull-down-to-refresh
  document.body.style.overflow = "hidden";
  document.body.style.overscrollBehaviorY = "contain";
  return {
    ...state,
    pressMode: true
  };
};

const handleUnpress = state => {
  // Enable scroll and pull-down-to-refresh
  document.body.style.overflow = state.defaultOverflow;
  document.body.style.overscrollBehaviorY = state.defaultOverscrollBehaviorY;
  return {
    ...state,
    pressMode: false
  };
};

const reducer = (state, action) => {
  log.debug("useBody reducer", action.type, state, action.payload);
  switch (action.type) {
    case "PRESS":
      return handlePress(state);
    case "UNPRESS":
      return handleUnpress(state);
    default:
      return state;
  }
};

// Reducer's action factory
const createDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });

function useBody(cursor) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  // (payload) => setAction("SOME_ACTION")
  const createAction = useCallback(createDispatcher(dispatch), []);
  // Actions
  const onPress = useCallback(createAction("PRESS"), []);
  const onUnpress = useCallback(createAction("UNPRESS"), []);
  useEffect(() => {
    cursor.isPress && !state.pressMode && onPress();
    !cursor.isPress && state.pressMode && onUnpress();
  }, [cursor.isPress, onPress, onUnpress, state.pressMode]);
  // Logging
  useEffect(() => log.debug("useBody state updated", state), [state]);

  return state;
}

export default useBody;
