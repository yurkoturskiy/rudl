import { pipe } from "ramda";

const setReferencedItem = (state, items) => ({
  ...state,
  referencedItem: items.find(item => !item.isSeparator)
});

const setItemWrapperId = state => ({
  ...state,
  itemWrapperId: `${state.referencedItem.id}-wrapper`
});

export default pipe(setReferencedItem, setItemWrapperId);
