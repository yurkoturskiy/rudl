import React from "react";
import initItem, { ItemType, ItemIdType } from "./initItem";
import { GetDraggableItemEventsTypes } from "../useCursor";

const getListOfItems = (
  children: React.ReactElement[],
  getDraggableItemEvents: GetDraggableItemEventsTypes
): ItemType[] => React.Children.map(children, initItem(getDraggableItemEvents));

export interface ItemsState {
  dragItemId: ItemIdType;
  dragItemIndex: number | null;
  overItemId: ItemIdType;
  overItemIndex: number | null;
  dragItemPrevOrder: number | null;
  dragItemNewOrder: number | null;
  isRearranges: boolean;
  setOverItem: (val: null) => void | null;
  items: ItemType[];
  getFirstItem: () => ItemType | undefined;
  transitionDuration?: number;
  onRearrange?(): void;
}

interface InitState {
  state: ItemsState;
  children: React.ReactElement[];
  getDraggableItemEvents: GetDraggableItemEventsTypes;
  transitionDuration?: number;
  onRearrange?: () => void;
}

export default ({
  state,
  children,
  getDraggableItemEvents,
  ...initArgs
}: InitState): ItemsState => ({
  ...state,
  ...initArgs,
  dragItemId: null,
  dragItemIndex: null,
  overItemId: null,
  overItemIndex: null,
  dragItemPrevOrder: null,
  dragItemNewOrder: null,
  isRearranges: false,
  setOverItem: null,
  items: getListOfItems(children, getDraggableItemEvents),
  // Methods
  getFirstItem: function () {
    return this.items.find((item: ItemType) => !item.isSeparator);
  },
});
