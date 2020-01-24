import React, { useRef, useEffect, useCallback, useReducer } from "react";
import { curry, pipe } from "ramda";
import PropTypes from "prop-types";
import createAction from "../utils/createAction";
import logger from "../utils/logger";

const { log } = logger("Endline");

const createReferencedAction = curry((dispatch, ref, type, event) =>
  dispatch({ type, payload: { ref, event } })
);

const setEndlineDistanceToTop = ({ state, ref, event }) => ({
  ...state,
  endlineDistanceToTop: ref.current.getBoundingClientRect().top
});

const setEndlineDistanceToViewport = state => ({
  ...state,
  endlineDistanceToViewport: state.endlineDistanceToTop - window.innerHeight
});

const handleScroll = pipe(
  setEndlineDistanceToTop,
  setEndlineDistanceToViewport
);

const endlineEnter = ({ state, onEndlineEnter, numOfLoadedItems }) => {
  onEndlineEnter();
  return { ...state, lastTriggeredNumOfItems: numOfLoadedItems };
};

const initState = ({ state } = {}) => ({
  ...state,
  endlineDistanceToTop: undefined,
  endlineDistanceToViewport: undefined,
  lastTriggeredNumOfItems: undefined
});

const reducer = (state, action) => {
  log.debug("Endline reducer", action.type, state, action.payload);
  switch (action.type) {
    case "SCROLL":
      return handleScroll({ state, ...action.payload });
    case "ENDLINE_ENTER":
      return endlineEnter({ state, ...action.payload });
    default:
      return state;
  }
};

function Endline({ layout, onEndlineEnter }) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  const endlineStartRef = useRef(); // Endline start sensor
  const endlineEndRef = useRef(); // Endline end sensor
  const startX = layout.endlineStartX;
  const startY = layout.endlineStartY;
  const endX = layout.endlineEndX;
  const endY = layout.endlineEndY;

  const handleScrollEvent = useCallback(
    createReferencedAction(dispatch, endlineStartRef, "SCROLL"),
    []
  );

  const handleEnlineEnter = useCallback(
    createAction(dispatch, "ENDLINE_ENTER")
  );

  useEffect(() => {
    state.endlineDistanceToViewport <= 0 &&
      state.lastTriggeredNumOfItems !== layout.numOfItems &&
      handleEnlineEnter({
        onEndlineEnter,
        numOfLoadedItems: layout.numOfItems
      });
  }, [handleEnlineEnter, layout.numOfItems, onEndlineEnter, state]);

  useEffect(() => {
    handleScrollEvent();
    layout.isMount && window.addEventListener("scroll", handleScrollEvent);
    return () => {
      layout.isMount && window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [handleScrollEvent, layout.isMount]);

  useEffect(() => log.debug("Endline state update", state), [state]);
  return (
    <>
      <div
        id="MasonryLayoutEndlineStart"
        ref={endlineStartRef}
        style={{
          position: "absolute",
          top: `${startY}px`,
          left: `${startX}px`
        }}
      />
      <div
        id="MasonryLayoutEndlineEnd"
        ref={endlineEndRef}
        style={{
          position: "absolute",
          top: `${endY}px`,
          left: `${endX}px`
        }}
      />
    </>
  );
}

Endline.propTypes = {
  layout: PropTypes.object,
  onEndlineEnter: PropTypes.func
};

export default Endline;
