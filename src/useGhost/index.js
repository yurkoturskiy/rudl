import React, { useReducer, useEffect, useCallback } from "react";
import { initState, drag, move } from "./reducerEventsHandlers";

const reducer = (state, action) => {
  switch (action.type) {
    case "DRAG":
      return drag({
        state,
        cursor: action.payload.cursor,
        item: action.payload.item
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

// Reducer's action factories
const plainDispatcher = dispatch => type => () => dispatch({ type });
const payloadDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });

// Hook
function useGhost(cursor, items) {
  const [ghost, dispatch] = useReducer(reducer, {}, initState);
  // Blank actions
  // () => plainAction("SOME_ACTION")
  const plainAction = useCallback(plainDispatcher(dispatch), []);
  // ({ cursor, items }) => payloadAction("SOME_ACTION")
  const payloadAction = useCallback(payloadDispatcher(dispatch), []);
  // Actions
  const onDrag = useCallback(payloadAction("DRAG"), []);
  const onMove = useCallback(payloadAction("MOVE"), []);
  const onDrop = useCallback(plainAction("DROP"), []);
  const onTransitionEnd = useCallback(plainAction("TRANSITION_END"), []);
  // Trigger actions
  useEffect(() => {
    cursor.isDrag && onDrag({ cursor, item: items[cursor.item.index] });
    cursor.isDrag && cursor.isMove && onMove({ cursor });
    !cursor.isDrag && onDrop();
  }, [cursor, cursor.isDrag, items, onDrag, onDrop, onMove]);

  return ghost;
}

export default useGhost;
