import React from "react";

const getSeparator = ({ child, index }) => ({
  // Separator is something like header or title
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  element: child
});

const getItem = ({ child, index, getDraggableItemEvents }) => ({
  // Item is just a regular layout unit
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  width: child.props.width,
  height: child.props.height,
  element: React.cloneElement(child, {
    ...child.props,
    draggableItem: getDraggableItemEvents({ index, id: child.key })
  })
});

const initItem = getDraggableItemEvents => (child, index) =>
  // Generate one item or separator
  child.props.isSeparator
    ? getSeparator({ child, index })
    : getItem({ child, index, getDraggableItemEvents });

const getListOfItems = ({ children, getDraggableItemEvents }) =>
  React.Children.map(children, initItem(getDraggableItemEvents));

export default ({ state, children, getDraggableItemEvents, ...initArgs }) => ({
  ...state,
  ...initArgs,
  dragItem: null,
  overItem: null,
  dragItemPrevOrder: null,
  dragItemNewOrder: null,
  isRearranges: false,
  list: getListOfItems({ children, getDraggableItemEvents })
});
