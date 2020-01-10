export const mouseMoveHandler = setMouse => e => {
  // Listen mouse movement on the document.
  e.preventDefault();
  e.stopPropagation();
  setMouse(mouse => ({ ...mouse, pos: { x: e.clientX, y: e.clientY } }));
};

export const onMouseDown = setMouse => itemIndex => e => {
  e.preventDefault();
  const pos = { x: e.clientX, y: e.clientY };
  setMouse({
    isDown: true,
    initialPos: pos,
    pos,
    preventClick: false,
    itemIndex
  });
};

export const onTouchStart = setTouch => itemIndex => e => {
  e.preventDefault();
  e.stopPropagation();
  const pos = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };
  setTouch({
    isActive: true,
    numOfFingers: e.touches.length,
    initialPos: pos,
    pos,
    itemIndex
  });
};

export const onTouchMove = setTouch => e => {
  e.preventDefault();
  e.stopPropagation();
  const pos = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };
  setTouch(touch => ({
    ...touch,
    pos
  }));
};
