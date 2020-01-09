export const mouseMoveHandler = setMousePos => e => {
  // Listen mouse movement on the document.
  e.preventDefault();
  e.stopPropagation();
  setMousePos({ x: e.clientX, y: e.clientY });
};
