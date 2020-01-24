import React, { useReducer, useCallback, useEffect } from "react";
import createAction from "../utils/createAction";
// Reducer handlers
import resize from "./reducerHandlers/resize";
// Logger
import logger from "../utils/logger";
const { log } = logger("useLayout");

const initState = ({ state } = {}) => ({
  ...state,
  isMount: false,
  transition: false,
  wrapperWidth: null,
  numOfColumns: null,
  // Number of items
  prevNumOfItems: null,
  numOfItems: null,
  // Referenced item as an example of unit's width
  referencedItem: null,
  itemWrapperWidth: null,
  itemWrapperId: null,
  itemWrapperElement: null,
  itemsSortedByOrder: null,
  units: null,
  // Endline
  endlinePerColumn: null,
  endlineStartX: null,
  endlineStartY: null,
  endlineEndX: null,
  endlineEndY: null,
  // Layout size
  width: null,
  height: null
});

const reducer = (state, action) => {
  log.debug("useLayout reducer", action.type, state, action.payload);
  switch (action.type) {
    case "RESIZE":
      return resize(state, ...action.payload);
  }
};

function useLayout(wrapperWidth, items) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  const action = useCallback(createAction(dispatch), []);
  // Resize
  useEffect(() => {
    wrapperWidth && action("RESIZE", [items, wrapperWidth]);
  }, [action, items, wrapperWidth]);
  // Logging
  useEffect(() => log.debug("useLayout state updated", state), [state]);

  return state;
}

export default useLayout;
