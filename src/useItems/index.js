import React, { useEffect, useMemo, useReducer, useCallback } from "react";
import reorder from "./reorder";
import init from "./init";
import logger from "../utils/logger";
import checkOverItem from "./checkOverItem";
import { type } from "ramda";
const { log } = logger("useItems");

const reducer = (state, action) => {
  log.debug("useItems reducer", action.type, state, action.payload);
  switch (action.type) {
    case "UPDATE":
      return init({ state, ...action.payload });
    case "CHECK_OVER_ITEM":
      return checkOverItem({ state, ...action.payload });
    case "REORDER":
      return reorder(state);
    case "REARRANGED":
      state.setOverItem(null);
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
    init({
      children,
      getDraggableItemEvents,
      transitionDuration,
      onRearrange
    })
  );
  // Actions from template
  const createAction = useCallback(createDispatcher(dispatch), []);
  const update = useCallback(createAction("UPDATE"), []);
  const checkOverItem = useCallback(createAction("CHECK_OVER_ITEM"), []);
  const reorder = useCallback(createAction("REORDER"), []);
  const rearranged = useCallback(createAction("REARRANGED"), []);
  // Update items when children changed
  useEffect(() => update({ children, getDraggableItemEvents }), [
    update,
    children,
    getDraggableItemEvents,
    transitionDuration,
    onRearrange
  ]);

  // Validate cursor items
  useEffect(() => {
    cursor.isDrag &&
      !state.isRearranges &&
      cursor.overItemId &&
      cursor.dragItemId &&
      cursor.overItemId !== cursor.dragItemId &&
      checkOverItem({
        dragItemId: cursor.dragItemId,
        dragItemIndex: cursor.dragItemIndex,
        overItemId: cursor.overItemId,
        overItemIndex: cursor.overItemIndex,
        setOverItem: cursor.setOverItem
      });
  }, [
    checkOverItem,
    cursor.dragItemId,
    cursor.dragItemIndex,
    cursor.isDrag,
    cursor.overItemId,
    cursor.overItemIndex,
    cursor.setOverItem,
    state.isRearranges
  ]);

  // Reorder on drag
  useEffect(() => {
    type(state.overItemIndex) === "Number" &&
      type(state.dragItemIndex) === "Number" &&
      reorder();
  }, [reorder, state.overItemIndex, state.dragItemIndex]);

  // Rearranging
  useEffect(() => {
    state.isRearranges && setTimeout(() => rearranged(), transitionDuration);
  }, [rearranged, state.isRearranges, transitionDuration]);
  // Logging
  useEffect(() => log.debug("useItems state update", state), [state]);

  return state;
}

export default useItems;
