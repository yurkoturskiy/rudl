import React, { useReducer, useEffect, useCallback } from "react";
import logger from "../utils/logger";
// Event handlers
import {
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
  longPress,
} from "./reducerEventsHandlers";
import { initState, CursorState } from "./initState";
// Hooks
import usePress from "./usePress";
import useDocumentEvents from "./useDocumentEvents";
import useClickCapture from "./useClickCapture";
import { ItemIdType, ItemType } from "../useItems/initItem";

const { log } = logger("useCursor");

interface Action {
  type: string;
  payload: any;
}

export type GetDraggableItemEventsTypes = (
  index: number,
  id: ItemIdType
) => DraggableItemEvents;

const reducer = (state: CursorState, action: Action): CursorState => {
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
        overItemId: action.payload,
      };
    default:
      return state;
  }
};

// Reducer's action factories
const createDispatcher = (dispatch: React.Dispatch<Action>) => (
  type: string
) => (payload: any) => dispatch({ type, payload });
const eventDispatcher = (dispatch: React.Dispatch<Action>) => (
  type: string
) => (event: Event) => dispatch({ type, payload: { event } });

const mouseDownEventDispatcher = (dispatch: React.Dispatch<Action>) => (
  type: string
) => (index: number, id: ItemIdType) => (event: MouseEvent) => {
  event.preventDefault();
  const pos = { x: event.clientX, y: event.clientY };
  dispatch({ type, payload: { pos, index, id } });
};

const touchStartEventDispatcher = (dispatch: React.Dispatch<Action>) => (
  type: string
) => (index: number, id: ItemIdType) => (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  const numOfCursors = event.touches.length;
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
  const touches = { numOfCursors, pos };
  dispatch({ type, payload: { touches, index, id } });
};

export interface DraggableItemEvents {
  onMouseDown(event: MouseEvent): void;
  onTouchStart(event: Event): void;
  onDragEnd(event: Event): void;
  onTouchEnd(event: Event): void;
}

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
  const getDraggableItemEvents: GetDraggableItemEventsTypes = useCallback(
    (index: number, id: ItemIdType): DraggableItemEvents => ({
      onMouseDown: mouseDownEventAction(index, id),
      onTouchStart: touchStartEventAction(index, id),
      onDragEnd: eventAction("DRAG_END"),
      onTouchEnd: eventAction("TOUCH_END"),
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
