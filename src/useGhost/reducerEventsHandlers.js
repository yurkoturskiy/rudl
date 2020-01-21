import { pipe } from "ramda";
import { cloneElement } from "react";
var useGhostLoglevel = require("loglevel").getLogger("ghost");

const log = (...labels) => value => {
  useGhostLoglevel.debug("useGhost debug:", ...labels, value);
  return value;
};

export const initState = ({ state } = {}) => ({
  ...state,
  isActive: false,
  isDrop: false,
  isTransit: false,
  id: null,
  pos: null,
  className: null,
  kernel: null,
  transDur: null,
  transTFunc: null,
  onTransitionEnd: null,
  transitionTimeout: null,
  // source
  sourceItem: null,
  sourceId: null,
  sourceElement: null,
  sourceClassList: null
});

const calcGhostPos = cursor => ({
  x: cursor.pos.x - cursor.dragPoint.x,
  y: cursor.pos.y - cursor.dragPoint.y
});

const setSourceItem = item => ({ sourceItem: item });
const setSourceId = ghost => ({ ...ghost, sourceId: ghost.sourceItem.id });
const setSourceElement = ghost => ({
  ...ghost,
  sourceElement: document.getElementById(ghost.sourceId)
});
const setClassList = ghost => ({
  ...ghost,
  sourceClassList: ghost.sourceElement.classList
});
const addGhostClass = ghost => {
  ghost.sourceClassList.add("ghost");
  return ghost;
};
const addTouchClass = cursor => ghost => {
  cursor.isTouch && ghost.sourceClassList.add("touch");
  return ghost;
};
const setGhostSource = ghost => ({ ...ghost });
const setGhostId = ghost => ({ ...ghost, id: `${ghost.sourceId}-ghost` });
const setGhostClassName = ghost => ({
  ...ghost,
  className: ghost.sourceClassList
});
const setGhostComponent = ghost => ({
  ...ghost,
  kernel: cloneElement(ghost.sourceItem.element, {
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
  pos: getWrapperFixedPosFromSourceId(state.sourceId),
  transitionTimeout: setTimeout(state.onTransitionEnd, state.transDur + 100)
});

const resetSourceClassList = sourceElement =>
  sourceElement.classList.remove("ghost", "touch");

export const end = ({ state }) => {
  log("end")();
  resetSourceClassList(state.sourceElement);
  clearTimeout(state.transitionTimeout);
  return initState({ state });
};

