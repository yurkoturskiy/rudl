import React, { useReducer, useCallback, useEffect } from "react";
import createAction from "../utils/createAction";
import logger from "../utils/logger";

const { log } = logger("useLoadHandler");

const initState = ({ state } = {}) => ({
  ...state,
  numOfErrors: 0,
  numOfLoads: 0
});

const reducer = (state, action) => {
  log.debug("useLoadHandler reducer", action.type, state, action.payload);
  switch (action.type) {
    case "ON_ERROR":
      return { ...state, numOfErrors: state.numOfErrors + 1 };
    case "ON_LOAD":
      return { ...state, numOfLoads: state.numOfLoads + 1 };
    default:
      return state;
  }
};

function useLoadHandler() {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  // (payload) => setAction("SOME_ACTION")
  const onError = useCallback(createAction(dispatch, "ON_ERROR"), []);
  const onLoad = useCallback(createAction(dispatch, "ON_LOAD"), []);
  // Logging
  useEffect(() => log.debug("useLoadHandler state update", state), [state]);

  return { ...state, onError, onLoad };
}

export default useLoadHandler;
