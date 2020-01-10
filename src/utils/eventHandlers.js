export const mouseMoveHandler = setMousePos => e => {
  // Listen mouse movement on the document.
  e.preventDefault();
  e.stopPropagation();
  setMousePos({ x: e.clientX, y: e.clientY });
};

export const onTouchStart = setTouch => itemIndex => e => {
  e.preventDefault();
  e.stopPropagation();
  setTouch({
    isActive: true,
    numOfFingers: e.touches.length,
    initialPos: {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    },
    itemIndex
  });
};

export const onTouchMove = setTouchPos => e => {
  e.preventDefault();
  e.stopPropagation();
  setTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
};
