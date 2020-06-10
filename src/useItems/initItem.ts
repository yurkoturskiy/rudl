import React from "react";
import { GetDraggableItemEventsTypes } from "../useCursor";

export type ItemIdType = string | number | null;

export interface ItemType {
  index: number;
  id: ItemIdType;
  order: number;
  isSeparator: false;
  width?: number;
  height?: number;
  element: React.ReactElement;
}

export const getSeparator = (
  child: React.ReactElement,
  index: number
): ItemType => ({
  // Separator is something like header or title
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  element: child,
});

export const getItem = (
  child: React.ReactElement,
  index: number,
  getDraggableItemEvents: GetDraggableItemEventsTypes
): ItemType => ({
  // Item is just a regular layout unit
  index: index,
  id: child.key,
  order: child.props.order,
  isSeparator: child.props.isSeparator,
  width: child.props.width,
  height: child.props.height,
  element: React.cloneElement(child, {
    ...child.props,
    draggableItem: getDraggableItemEvents(index, child.key),
  }),
});

const initItem = (getDraggableItemEvents: GetDraggableItemEventsTypes) => (
  child: React.ReactElement,
  index: number
): ItemType =>
  // Generate one item or separator
  child.props.isSeparator
    ? getSeparator(child, index)
    : getItem(child, index, getDraggableItemEvents);

export default initItem;
