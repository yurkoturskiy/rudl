import { pipe, subtract, lt, tryCatch } from "ramda";
import errorHandler from "../utils/errorHandler";

// Delta from initial pos and current pos
const deltaMT2 = pipe(subtract, Math.abs, lt(2));
const distanceIsMT2 = (pos, initialPos) =>
  deltaMT2(pos.x, initialPos.x) || deltaMT2(pos.y, initialPos.y);

// Initial Cursor Point
const getRectFromItemId = dragItemId => () =>
  document.getElementById(`${dragItemId}-wrapper`).getBoundingClientRect();
const calcItemInitPointFromPos = pos => rect => ({
  x: pos.x - rect.left,
  y: pos.y - rect.top
});
const roundPos = pos => ({
  x: Math.round(pos.x),
  y: Math.round(pos.y)
});

const calcItemInitPoint = (pos, dragItemId) =>
  pipe(getRectFromItemId(dragItemId), calcItemInitPointFromPos(pos), roundPos);

const tryCalcItemInitPoint = (pos, dragItemId) =>
  tryCatch(calcItemInitPoint(pos, dragItemId), errorHandler)();

const getElementIdFromPoint = pos => document.elementFromPoint(pos.x, pos.y).id;
const getIdFromPos = pos => tryCatch(getElementIdFromPoint, errorHandler)(pos);

export const initState = ({ state } = {}) => ({
  ...state,
  isMouse: false,
  isTouch: false,
  isPress: false,
  isLongPress: false,
  isMove: false,
  isDrag: false,
  pos: null,
  initialPos: null,
  numOfCursors: null,
  // Item scope
  dragItemId: null,
  dragItemIndex: null,
  dragPoint: null,
  overItemId: null,
  overItemIndex: null
});

// Mouse events handlers

export const mouseMove = ({ state, event }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = { x: event.clientX, y: event.clientY };
  const isMove = state.isMove || distanceIsMT2(pos, state.initialPos);
  const isDrag = state.isDrag || isMove;
  const preventClick = state.preventClick || isDrag;
  const overItemId = getIdFromPos(pos);
  return { ...state, pos, isMove, isDrag, preventClick, overItemId };
};

export const mouseDown = ({ state, event, item }) => {
  event.preventDefault();
  const pos = { x: event.clientX, y: event.clientY };
  return {
    ...state,
    isMouse: true,
    initialPos: pos,
    dragItemId: item.id,
    dragItemIndex: item.index,
    pos,
    dragPoint: tryCalcItemInitPoint(pos, item.id)
  };
};

// export const mouseEnter = ({ state, event, item }) => ({
//   ...state,
//   overItemId: item.id,
//   overItemIndex: item.index
// });

export const clickCapture = ({ state, event }) => {
  // Prevent onClick event when dragging
  state.preventClick && event.stopPropagation();
  return {
    ...state,
    preventClick: false
  };
};

// Touch events handlers

export const touchStart = ({ state, event, item }) => {
  event.preventDefault();
  event.stopPropagation();
  const numOfCursors = event.touches.length;
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
  return {
    ...state,
    isTouch: true,
    initialPos: pos,
    numOfCursors,
    dragItemId: item.id,
    dragItemIndex: item.index,
    pos
  };
};

export const touchMove = ({ state, event, item }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
  const isMove = state.isMove || distanceIsMT2(pos, state.initialPos);
  const overItemId = getIdFromPos(pos);
  return { ...state, pos, isMove, overItemId };
};

// Gestures
export const press = ({ state }) => ({
  ...state,
  isPress: !state.isMove
});
export const longPress = ({ state }) => ({
  ...state,
  isLongPress: !state.isMove,
  isDrag: !state.isMove,
  dragPoint: tryCalcItemInitPoint(state.initialPos, state.dragItemId)
});
