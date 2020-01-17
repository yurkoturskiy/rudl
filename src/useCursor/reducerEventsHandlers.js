import { pipe, subtract, lt, tryCatch } from "ramda";
import errorHandler from "../utils/errorHandler";

// Delta from initial pos and current pos
const deltaMT2 = pipe(subtract, Math.abs, lt(2));
const distanceIsMT2 = (pos, initialPos) =>
  deltaMT2(pos.x, initialPos.x) || deltaMT2(pos.y, initialPos.y);

// Initial Cursor Point
const getRectFromItemId = item => () =>
  document.getElementById(`${item.id}-wrapper`).getBoundingClientRect();
const calcItemInitPointFromPos = pos => rect => ({
  x: pos.x - rect.left,
  y: pos.y - rect.top
});
const roundPos = pos => ({
  x: Math.round(pos.x),
  y: Math.round(pos.y)
});

const calcItemInitPoint = (pos, item) =>
  pipe(getRectFromItemId(item), calcItemInitPointFromPos(pos), roundPos);

const tryCalcItemInitPoint = (pos, item) =>
  tryCatch(calcItemInitPoint(pos, item), errorHandler)();

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
  item: null,
  dragPoint: null,
  overItem: null
});

// Mouse events handlers

export const mouseMove = ({ state, event }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = { x: event.clientX, y: event.clientY };
  const isMove = state.isMove || distanceIsMT2(pos, state.initialPos);
  const isDrag = state.isDrag || isMove;
  const preventClick = state.preventClick || isDrag;
  return { ...state, pos, isMove, isDrag, preventClick };
};

export const mouseDown = ({ state, event, item }) => {
  event.preventDefault();
  const pos = { x: event.clientX, y: event.clientY };
  return {
    ...state,
    isMouse: true,
    initialPos: pos,
    item,
    pos,
    dragPoint: tryCalcItemInitPoint(pos, item)
  };
};

export const mouseEnter = ({ state, event, item }) => ({
  ...state,
  overItem: item
});

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
    item,
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
  const overItem = { id: getIdFromPos(pos) };
  return { ...state, pos, isMove, overItem };
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
  dragPoint: tryCalcItemInitPoint(state.initialPos, state.item)
});
