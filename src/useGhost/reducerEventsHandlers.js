import { pipe } from "ramda";
import { cloneElement } from "react";

export const initState = ({ state } = {}) => ({
  ...state,
  isActive: false,
  isDrop: false,
  isTransit: false,
  id: null,
  pos: null,
  source: null,
  className: null,
  kernel: null,
  transDur: null,
  transTFunc: null,
  onTransitionEnd: null,
  transitionTimeout: null
});

const log = label => value => {
  console.log(label, value);
  return value;
};

const calcGhostPos = cursor => ({
  x: cursor.pos.x - cursor.dragPoint.x,
  y: cursor.pos.y - cursor.dragPoint.y
});

const setSourceItem = item => ({ item });
const setSourceId = source => ({ ...source, id: source.item.id });
const setSourceElement = source => ({
  ...source,
  element: document.getElementById(source.id)
});
const setClassList = source => ({
  ...source,
  classList: source.element.classList
});
const addGhostClass = source => {
  source.classList.add("ghost");
  return source;
};
const addTouchClass = cursor => source => {
  cursor.isTouch && source.classList.add("touch");
  return source;
};
const setGhostSource = source => ({ source });
const setGhostId = ghost => ({ ...ghost, id: `${ghost.source.id}-ghost` });
const setGhostClassName = ghost => ({
  ...ghost,
  className: ghost.source.classList
});
const setGhostComponent = ghost => ({
  ...ghost,
  kernel: cloneElement(ghost.source.item.element, {
    draggableItem: { id: ghost.id, className: ghost.className }
  })
});
const setGhostPos = cursor => ghost => ({
  ...ghost,
  pos: calcGhostPos(cursor)
});
const setIsActive = ghost => ({ ...ghost, isActive: true });

const setGhost = cursor =>
  pipe(
    setSourceItem,
    setSourceId,
    setSourceElement,
    setClassList,
    addGhostClass,
    addTouchClass(cursor),
    setGhostSource,
    setGhostId,
    setGhostClassName,
    setGhostComponent,
    setGhostPos(cursor),
    setIsActive,
    log("setGhost")
  );

export const start = ({
  state,
  cursor,
  item,
  transitionParams,
  onTransitionEnd
}) => {
  const ghost = setGhost(cursor)(item);
  return {
    ...state,
    ...ghost,
    transDur: transitionParams.ghostTransitionDuration,
    transTFunc: transitionParams.ghostTransitionTimingFunction,
    onTransitionEnd
  };
};

const calcMovePos = pipe(calcGhostPos, log("calcMovePos"));

export const move = ({ state, cursor }) => ({
  ...state,
  pos: calcMovePos(cursor)
});

/* Drop */
const setWrapperId = sourceId => `${sourceId}-wrapper`;
const getElementById = id => document.getElementById(id);
const getRectFromElement = element => element.getBoundingClientRect();
const getPosFromRect = rect => ({ x: rect.left, y: rect.top });
const getWrapperFixedPosFromSourceId = pipe(
  setWrapperId,
  getElementById,
  getRectFromElement,
  getPosFromRect,
  log("getWrapperFixedPosFromSourceId")
);

export const drop = ({ state }) => ({
  ...state,
  isDrop: true,
  isTransit: true,
  pos: getWrapperFixedPosFromSourceId(state.source.id),
  transitionTimeout: setTimeout(state.onTransitionEnd, state.transDur + 100)
});
