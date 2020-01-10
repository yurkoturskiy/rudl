export const mouseMoveHandler = setMousePos => e => {
  // Listen mouse movement on the document.
  e.preventDefault();
  e.stopPropagation();
  setMousePos({ x: e.clientX, y: e.clientY });
};

export const onTouchMove = setTouchPos => e => {
  e.preventDefault();
  e.stopPropagation();
  setTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
};
