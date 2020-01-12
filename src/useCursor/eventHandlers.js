export const mouseMove = ({ state, event }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = { x: event.clientX, y: event.clientY };
  return { ...state, pos };
};

export const mouseDown = ({ state, event, itemIndex }) => {
  event.preventDefault();
  const pos = { x: event.clientX, y: event.clientY };
  return {
    ...state,
    isMouse: true,
    initialPos: pos,
    itemIndex,
    pos
  };
};

export const mouseEnter = ({ state, event, itemIndex }) => ({
  ...state,
  overItemIndex: itemIndex
});

export const touchStart = ({ state, event, itemIndex }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
  return {
    ...state,
    isTouch: true,
    initialPos: pos,
    numOfCursors: e.touches.length,
    itemIndex,
    pos
  };
};

export const touchMove = ({ state, event, itemIndex }) => {
  event.preventDefault();
  event.stopPropagation();
  const pos = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
  return { ...state, pos };
};
