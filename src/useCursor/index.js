import React, { useReducer, useEffect, useCallback } from "react";
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
import useMouseMoveEvent from "./useMouseMoveEvent";
import useMouseUpEvent from "./useMouseUpEvent";


const reducer = (state, action) => {
  switch (action.type) {
    // Mouse
    case "MOUSE_MOVE":
      return mouseMove({ state, ...action.payload });
    case "MOUSE_ENTER":
      return mouseEnter({ state, ...action.payload });
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
    default:
      return state;
  }
};

// Reducer's action factories
const plainDispatcher = dispatch => type => () => dispatch({ type });
const eventDispatcher = dispatch => type => event =>
  dispatch({ type, payload: { event } });
const itemEventDispatcher = dispatch => type => item => event =>
  dispatch({ type, payload: { event, item } });

// Hook
function useCursor() {
  const [cursor, dispatch] = useReducer(reducer, {}, initState);
  // Blank actions
  // () => plainAction("SOME_ACTION")
  const plainAction = useCallback(plainDispatcher(dispatch), []);
  // (e) => eventAction("SOME_ACTION")
  const eventAction = useCallback(eventDispatcher(dispatch), []);
  // (e) => itemEventAction("SOME_ACTION")(index)
  const itemEventAction = useCallback(itemEventDispatcher(dispatch), []);
  // Item's scope cursor events
  const getDraggableItemEvents = useCallback(
    ({ index, id }) => ({
      onMouseDown: itemEventAction("MOUSE_DOWN")({ index, id }),
      onMouseEnter: itemEventAction("MOUSE_ENTER")({ index, id }),
      onDragEnd: eventAction("DRAG_END"),
      onTouchStart: itemEventAction("TOUCH_START")({ index, id }),
      // onTouchMove: itemEventAction("TOUCH_MOVE")(index),
      onTouchEnd: eventAction("TOUCH_END"),
      onClickCapture: eventAction("CLICK_CAPTURE")
    }),
    [eventAction, itemEventAction]
  );
  // Log effect
  useEffect(() => console.log(cursor), [cursor]);

  useMouseMoveEvent({ isMouse: cursor.isMouse, eventAction });
  useMouseUpEvent({ eventAction });

  return { cursor, getDraggableItemEvents };
}
