import React from "react";
import initItem, { ItemType } from "./initItem";

const getListOfItems = ({ children, getDraggableItemEvents }) =>
  React.Children.map(children, initItem(getDraggableItemEvents));

interface State {
  dragItemId: string;
  dragItemIndex: number;
  overItemId: string;
  overItemIndex: number;
  dragItemPrevOrder: number;
  dragItemNewOrder: number;
  isRearranges: boolean;
}

export default ({ state, children, getDraggableItemEvents, ...initArgs }) => ({
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
  items: getListOfItems({ children, getDraggableItemEvents }),
  // Methods
  getFirstItem: function () {
    return this.items.find((item: ItemType) => !item.isSeparator);
  },
});
