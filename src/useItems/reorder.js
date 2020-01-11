import { pipe, map } from "ramda";

const assignNewOrder = ({ dragItemOrder = 1, overItemOrder = 0 }) => item => {
  let { order } = item; // Item is out of range. Keep same order

  // Override for items need to be changed
  if (dragItemOrder < overItemOrder) {
    // Drag toward the end
    if (order > dragItemOrder && order <= overItemOrder)
      // Inbetween notes. Replace on one to the start
      order -= 1;
    else if (order === dragItemOrder)
      // Assign new order to the draggable
      order = overItemOrder;
  } else if (dragItemOrder > overItemOrder) {
    // Drag toward the start
    if (order < dragItemOrder && order >= overItemOrder)
      // Inbetween notes. Replace on one to the end
      order += 1;
    else if (order === dragItemOrder)
      // Assign new order to the draggable
      order = overItemOrder;
  }
  return { ...item, order };
};

const mapArgs = ({ state, dragItemIndex = 1, overItemIndex = 0 }) => ({
  items: state,
  dragItemOrder: state[dragItemIndex].order,
  overItemOrder: state[overItemIndex].order
});

const mapItems = fn => ({ items, dragItemOrder, overItemOrder }) =>
  map(fn({ dragItemOrder, overItemOrder }), items);

export default pipe(mapArgs, mapItems(assignNewOrder));
