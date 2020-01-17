import React, { useReducer, useEffect, useCallback } from "react";
import { initState, start, move, drop, end } from "./reducerEventsHandlers";

const reducer = (state, action) => {
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
    case "TRANSITION_END":
      break;
    case "DROP": // On cursor end drag
      return drop({ state });
    default:
      return state;
  }
};

// Reducer's action factory
const payloadDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });

// Hook
function useGhost(cursor, items, transitionParams) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  // (payload) => setAction("SOME_ACTION")
  const setAction = useCallback(payloadDispatcher(dispatch), []);
  // Actions
  const onStart = useCallback(setAction("START"), []);
  const onMove = useCallback(setAction("MOVE"), []);
  const onDrop = useCallback(setAction("DROP"), []);
  // Ghost component action
  const onTransitionEnd = useCallback(setAction("END"), []);

  useEffect(() => {
    // Start on cursor drag
    cursor.isDrag &&
      !state.isActive &&
      onStart({
        cursor,
        item: items[cursor.item.index],
        transitionParams,
        onTransitionEnd
      });
    // Move on cursor move
    cursor.isDrag && cursor.isMove && cursor.pos && onMove({ cursor });
    // Drop on cursor up
    state.isActive && !cursor.isDrag && !state.isDrop && onDrop();
  }, [
    cursor,
    state,
    items,
    onStart,
    onDrop,
    onMove,
    onTransitionEnd,
    transitionParams
  ]);

  return ghost;
}

export default useGhost;
