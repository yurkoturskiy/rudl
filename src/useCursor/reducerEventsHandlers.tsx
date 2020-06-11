import { pipe, subtract, lt, tryCatch } from "ramda";
import errorHandler from "../utils/errorHandler";
import { CursorState as State, Pos } from "./initState";

// Delta from initial pos and current pos
const deltaMT2 = pipe(subtract, Math.abs, lt(2));
const distanceIsMT2 = (pos, initialPos) =>
  deltaMT2(pos.x, initialPos.x) || deltaMT2(pos.y, initialPos.y);

// Initial Cursor Point
const getRectFromItemId = (dragItemId) => () =>
  document.getElementById(`${dragItemId}-wrapper`).getBoundingClientRect();
const calcItemInitPointFromPos = (pos) => (rect) => ({
  x: pos.x - rect.left,
  y: pos.y - rect.top,
});
const roundPos = (pos) => ({
  x: Math.round(pos.x),
  y: Math.round(pos.y),
});

const calcItemInitPoint = (pos, dragItemId) =>
  pipe(getRectFromItemId(dragItemId), calcItemInitPointFromPos(pos), roundPos);

const tryCalcItemInitPoint = (pos, dragItemId) =>
  tryCatch(calcItemInitPoint(pos, dragItemId), errorHandler)();

const getElementIdFromPoint = (pos) =>
  document.elementFromPoint(pos.x, pos.y).id;
const getIdFromPos = (pos: Pos) =>
  tryCatch(getElementIdFromPoint, errorHandler)(pos);

// Mouse events handlers

interface mouseMove {
  state: State;
  event: React.MouseEvent;
}

export const mouseMove = ({ state, event }: mouseMove) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = { x: event.clientX, y: event.clientY };
  const isMove = state.isMove || distanceIsMT2(pos, state.initialPos);
  const isDrag = state.isDrag || isMove;
  const preventClick = state.preventClick || isDrag;
  const overItemId = getIdFromPos(pos);
  return { ...state, pos, isMove, isDrag, preventClick, overItemId };
};

interface MouseDown {
  state: State;
  pos: Pos;
}

export const mouseDown = ({ state, pos, item }) => ({
  ...state,
  isMouse: true,
  initialPos: pos,
  dragItemId: item.id,
  dragItemIndex: item.index,
  pos,
  dragPoint: tryCalcItemInitPoint(pos, item.id),
});

export const clickCapture = ({ state, event }) => {
  // Prevent onClick event when dragging
  state.preventClick && event.stopPropagation();
  return {
    ...state,
    preventClick: false,
  };
};

// Touch events handlers

export const touchStart = ({ state, touches, item }) => ({
  ...state,
  isTouch: true,
  initialPos: touches.pos,
  numOfCursors: touches.numOfCursors,
  dragItemId: item.id,
  dragItemIndex: item.index,
  pos: touches.pos,
});

export const touchMove = ({ state, event, item }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
  const isMove = state.isMove || distanceIsMT2(pos, state.initialPos);
  const overItemId = getIdFromPos(pos);
  return { ...state, pos, isMove, overItemId };
};

// Gestures
export const press = ({ state }) => ({
  ...state,
  isPress: !state.isMove,
});
export const longPress = ({ state }) => ({
  ...state,
  isLongPress: !state.isMove,
  isDrag: !state.isMove,
  dragPoint: tryCalcItemInitPoint(state.initialPos, state.dragItemId),
});
