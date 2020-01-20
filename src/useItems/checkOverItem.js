import { pipe } from "ramda";

const findItemById = (items, id) => items.find(item => item.id === id);
const getIndexFromItem = item => (item ? item.index : null);
const getIndexFromId = pipe(findItemById, getIndexFromItem);

const checkOverItem = ({
  state,
  overItemIndex,
  overItemId,
  dragItemIndex,
  dragItemId,
  setOverItem
}) => ({
  ...state,
  overItemId,
  overItemIndex: overItemIndex || getIndexFromId(state.list, overItemId),
  dragItemId,
  dragItemIndex,
  setOverItem
});

export default checkOverItem;
