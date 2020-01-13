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

// Action factories
const eventDispatcher = dispatch => type => event =>
  dispatch({ type, payload: { event } });

const itemEventDispatcher = dispatch => type => itemIndex => event =>
  dispatch({ type, payload: { event, itemIndex } });

export default function useCursor() {
  const [cursor, dispatch] = useReducer(reducer, {}, init);

  // Actions factories
  const eventAction = useCallback(eventDispatcher(dispatch), [dispatch]);
  const itemEventAction = useCallback(itemEventDispatcher(dispatch), [
    dispatch
  ]);

  const getDraggableItemEvents = useCallback(
    index => ({
      onMouseDown: itemEventAction("MOUSE_DOWN")(index),
      onMouseEnter: itemEventAction("MOUSE_ENTER")(index),
      onDragEnd: eventAction("DRAG_END"),
      onTouchStart: itemEventAction("TOUCH_START")(index),
      onTouchMove: eventAction("TOUCH_MOVE"),
      onTouchEnd: eventAction("TOUCH_END")
    }),
    [itemEventAction, eventAction]
  );
  // Log effect
  useEffect(() => console.log(cursor), [cursor]);

  useMouseMoveEvent({ isMouse: cursor.isMouse, eventAction });
  useMouseUpEvent({ eventAction });

  return { cursor, getDraggableItemEvents };
}
