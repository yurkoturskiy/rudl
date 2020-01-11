import React from "react";

const getSeparator = ({ child, index }) => ({
  // Separator is something like header or title
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  element: child
});

const getItem = ({ child, index, initDraggableItem }) => ({
  // Item is just a regular layout unit
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  width: child.props.width,
  height: child.props.height,
  element: React.cloneElement(child, {
    ...child.props,
    draggableItem: initDraggableItem(index)
  })
});

const initItem = initDraggableItem => (child, index) =>
  // Generate one item or separator
  child.props.isSeparator
    ? getSeparator({ child, index })
    : getItem({ child, index, initDraggableItem });

export default ({ children, initDraggableItem }) =>
  React.Children.map(children, initItem(initDraggableItem));
