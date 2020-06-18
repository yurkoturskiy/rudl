import { pipe } from "ramda";
import { ItemsState } from "./initState";
import { ItemIdType, ItemType } from "./initItem";

const findItemById = (
  items: ItemType[],
  id: ItemIdType
): ItemType | undefined => items.find((item) => item.id === id);
const getIndexFromItem = (item: ItemType): number | null =>
  item ? item.index : null;
const getIndexFromId = pipe(findItemById, getIndexFromItem);

interface Props {
  state: ItemsState;
  overItemIndex: number;
  overItemId: ItemIdType;
  dragItemIndex: number;
  dragItemId: ItemIdType;
  setOverItem(val: null): void;
}

const checkOverItem = ({
  state,
  overItemIndex,
  overItemId,
  dragItemIndex,
  dragItemId,
  setOverItem,
}: Props): ItemsState => ({
  ...state,
  overItemId,
  overItemIndex: overItemIndex || getIndexFromId(state.items, overItemId),
  dragItemId,
  dragItemIndex,
  setOverItem,
});

export default checkOverItem;
