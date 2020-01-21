const resize = state => ({
  ...state,
  numOfColumns: Math.floor(state.wrapperWidth / state.itemWrapperWidth)
});

export default resize;
