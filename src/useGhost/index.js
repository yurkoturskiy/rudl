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
    case "MOVE":
      return move({ state, cursor: action.payload.cursor });
    case "DROP":
      break;
    case "TRANSITION_END":
      break;
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
    cursor.isDrag && cursor.isMove && onMove({ cursor });
    !cursor.isDrag && onDrop();
    // Start on cursor drag
    cursor.isDrag &&
      !state.isActive &&
      onStart({
        cursor,
        item: items[cursor.item.index],
        transitionParams,
        onTransitionEnd
      });
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
