import React, { useEffect, useMemo, useReducer, useCallback } from "react";
import reorder from "./reorder";
import init from "./init";
import logger from "../utils/logger";
const { log } = logger("useItems");

const reducer = (state, action) => {
  log.debug("useItems reducer", action.type, state, action.payload);
  switch (action.type) {
    case "UPDATE":
      return init({ state, ...action.payload });
    case "REORDER":
      return reorder({ state, ...action.payload });
    case "REARRANGED":
      return { ...state, isRearranges: false };
    default:
      return state;
  }
};

const createDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });

function useItems({
  children,
  getDraggableItemEvents,
  cursor,
  transitionDuration,
  onRearrange
}) {
  const [state, dispatch] = useReducer(reducer, [], () =>
    init({ children, getDraggableItemEvents, transitionDuration, onRearrange })
  );
  // Actions from template
  const createAction = useCallback(createDispatcher(dispatch), []);
  const onUpdate = useCallback(createAction("UPDATE"), []);
  const onReorder = useCallback(createAction("REORDER"), []);
  const onRearranged = useCallback(createAction("REARRANGED"), []);
  // Update items when children changed
  useEffect(() => onUpdate({ children, getDraggableItemEvents }), [
    onUpdate,
    children,
    getDraggableItemEvents,
    transitionDuration,
    onRearrange
  ]);
  // Reorder on drag
  useEffect(() => {
    cursor.isDrag &&
      !state.isRearranges &&
      cursor.overItem &&
      cursor.item &&
      cursor.overItem.index !== cursor.item.index &&
      onReorder({
        dragItem: cursor.item,
        overItem: cursor.overItem
      });
  }, [
    cursor.isDrag,
    state.isRearranges,
    onReorder,
    cursor.overItem,
    cursor.item
  ]);
  // Rearranging
  useEffect(() => {
    state.isRearranges && setTimeout(() => onRearranged(), transitionDuration);
  }, [onRearranged, state.isRearranges, transitionDuration]);
  // Logging
  useEffect(() => log.debug("useItems state update", state), [state]);

  return [state.list, onReorder];
}

export default useItems;
