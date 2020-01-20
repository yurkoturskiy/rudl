import React, { useReducer, useEffect, useCallback } from "react";
import { initState, start, move, drop, end } from "./reducerEventsHandlers";
import Ghost from "../components/Ghost";
import logger from "../utils/logger";

const { log } = logger("useGhost");

const reducer = (state, action) => {
  log.debug("useGhost reducer", action.type, state, action.payload);
  switch (action.type) {
    case "START": // On cursor drag
      return start({
        state,
        cursor: action.payload.cursor,
        item: action.payload.item,
        transitionParams: action.payload.transitionParams,
        onTransitionEnd: action.payload.onTransitionEnd
      });
    case "MOVE": // On cursor move
      return move({ state, cursor: action.payload.cursor });
    case "DROP": // On cursor end drag
      return drop({ state });
    case "END": // On transition end
      return end({ state });
    default:
      return state;
  }
};

// Reducer's action factory
const createDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });

// Hook
function useGhost(cursor, items, transitionParams) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  // (payload) => setAction("SOME_ACTION")
  const createAction = useCallback(createDispatcher(dispatch), []);
  // Actions
  const onStart = useCallback(createAction("START"), []);
  const onMove = useCallback(createAction("MOVE"), []);
  const onDrop = useCallback(createAction("DROP"), []);
  // Ghost component action
  const onTransitionEnd = useCallback(createAction("END"), []);

  // Start on cursor drag
  useEffect(() => {
    cursor.isDrag &&
      !state.isActive &&
      onStart({
        cursor,
        item: items[cursor.dragItemIndex],
        transitionParams,
        onTransitionEnd
      });
  }, [
    cursor,
    items,
    onStart,
    onTransitionEnd,
    state.isActive,
    transitionParams
  ]);

  // Move on cursor move
  useEffect(() => {
    cursor.isDrag && cursor.isMove && cursor.pos && onMove({ cursor });
  }, [cursor, onMove]);

  // Drop on cursor up
  useEffect(() => {
    state.isActive && !cursor.isDrag && !state.isDrop && onDrop();
  }, [cursor.isDrag, onDrop, state.isActive, state.isDrop]);

  // Log effect
  useEffect(() => log.debug("useGhost state update", state), [state]);

  const component = state.isActive && <Ghost {...state} />;
  return { ...state, component };
}

export default useGhost;
