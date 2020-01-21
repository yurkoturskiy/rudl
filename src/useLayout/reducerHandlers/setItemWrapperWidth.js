import { pipe } from "ramda";

const setItemWrapperElement = state => ({
  ...state,
  itemWrapperElement: document.getElementById(state.itemWrapperId)
});

const setItemWrapperWidth = (state, item) => ({
  ...state,
  itemWrapperWidth: state.itemWrapperElement.offsetWidth
});

export default pipe(setItemWrapperElement, setItemWrapperWidth);
