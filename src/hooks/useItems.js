import React, { useEffect, useState, useReducer } from "react";

const generateSeparator = ({ child, index }) => ({
  // Separator is something like header or title
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  element: child
});

const generateItem = ({ child, index, draggableItem }) => ({
  // Item is just a regular layout unit
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  width: child.props.width,
  height: child.props.height,
  element: React.cloneElement(child, {
    ...child.props,
    draggableItem
  })
});

const createItem = draggableItem => (child, index) =>
  // Generate one item or separator
  child.props.isSeparator
    ? generateSeparator({ child, index })
    : generateItem({ child, index, draggableItem });

const createItems = ({ children, draggableItem }) =>
  React.Children.map(children, createItem(draggableItem));

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return createItems(action.payload);

    default:
      return state;
  }
};

const actionTemplate = dispatch => type => payload =>
  dispatch({ type, payload });

export default function useItems(children, draggableItem) {
  const [items, dispatch] = useReducer(reducer, [], () =>
    createItems({ children, draggableItem })
  );

  // Actions from template
  const blank = useMemo(() => actionTemplate(dispatch), [dispatch]);
  const update = useMemo(() => blank("UPDATE"), [blank]);
  const reorder = useMemo(() => blank("REORDER"), [blank]);

  useEffect(() => {
    update({ children, draggableItem });
  }, [children, update, draggableItem]);

  return items;
}
