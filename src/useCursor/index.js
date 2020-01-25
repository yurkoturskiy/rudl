import React, { useReducer, useEffect, useCallback } from "react";
import logger from "../utils/logger";
// Event handlers
import {
  initState,
  // Mouse
  mouseMove,
  mouseEnter,
  mouseDown,
  clickCapture,
  // Touch
  touchStart,
  touchMove,
  // Gestures
  press,
  longPress
} from "./reducerEventsHandlers";
// Hooks
import usePress from "./usePress";
import useDocumentEvents from "./useDocumentEvents";
import useClickCapture from "./useClickCapture";

const { log } = logger("useCursor");

const reducer = (state, action) => {
  log.debug("useCursor reducer", action.type, state, action.payload);
  switch (action.type) {
    // Mouse
    case "MOUSE_MOVE":
      return mouseMove({ state, ...action.payload });
    case "MOUSE_DOWN":
      return mouseDown({ state, ...action.payload });
    case "MOUSE_UP":
      return initState({ state });
    case "DRAG_END":
      return initState({ state });
    case "CLICK_CAPTURE":
      return clickCapture({ state, ...action.payload });
    // Touch
    case "TOUCH_START":
      return touchStart({ state, ...action.payload });
    case "TOUCH_MOVE":
      return touchMove({ state, ...action.payload });
    case "TOUCH_END":
      return initState({ state });
    // Touch gestures
    case "PRESS":
      return press({ state });
    case "LONG_PRESS":
      return longPress({ state });
    // Methods
    case "SET_METHODS":
      return { ...state, ...action.payload };
    case "SET_OVER_ITEM":
      return {
        ...state,
        overItemIndex: action.payload,
        overItemId: action.payload
      };
    default:
      return state;
  }
};

// Reducer's action factories
const createDispatcher = dispatch => type => payload =>
  dispatch({ type, payload });
const eventDispatcher = dispatch => type => event =>
  dispatch({ type, payload: { event } });

const mouseDownEventDispatcher = dispatch => type => item => event => {
  event.preventDefault();
  const pos = { x: event.clientX, y: event.clientY };
  dispatch({ type, payload: { pos, item } });
};

const touchStartEventDispatcher = dispatch => type => item => event => {
  event.preventDefault();
  event.stopPropagation();
  const numOfCursors = event.touches.length;
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
  const touches = { numOfCursors, pos };
  dispatch({ type, payload: { touches, item } });
};

// Hook
function useCursor() {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  // Blank actions
  // () => createAction("SOME_ACTION")
  const createAction = useCallback(createDispatcher(dispatch), []);
  // (e) => eventAction("SOME_ACTION")
  const eventAction = useCallback(eventDispatcher(dispatch), []);
  // (e) => itemEventAction("SOME_ACTION")(index)
  const mouseDownEventAction = useCallback(
    mouseDownEventDispatcher(dispatch)("MOUSE_DOWN"),
    []
  );
  const touchStartEventAction = useCallback(
    touchStartEventDispatcher(dispatch)("TOUCH_START"),
    []
  );
  // Item's scope cursor events
  const getDraggableItemEvents = useCallback(
    ({ index, id }) => ({
      onMouseDown: mouseDownEventAction({ index, id }),
      onTouchStart: touchStartEventAction({ index, id }),
      onDragEnd: eventAction("DRAG_END"),
      onTouchEnd: eventAction("TOUCH_END")
    }),
    [eventAction, mouseDownEventAction, touchStartEventAction]
  );
  // Global scope cursor events
  useDocumentEvents({ ...state, eventAction });
  usePress({ createAction, ...state });
  useClickCapture({ dragItemId: state.dragItemId, eventAction });
  // Log effect
  useEffect(() => log.debug("useCursor state update", state), [state]);

  // Methods
  const setMethods = useCallback(createAction("SET_METHODS"), []);
  const setOverItem = useCallback(createAction("SET_OVER_ITEM"), []);
  useEffect(() => setMethods({ setOverItem }), [setMethods, setOverItem]);

  return [state, getDraggableItemEvents];
}

export default useCursor;
