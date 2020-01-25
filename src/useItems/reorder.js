import { pipe, map } from "ramda";
import logger from "../utils/logger";
const { trace } = logger("useItems");

const assignNewOrder = ([
  dragItemPrevOrder = 1,
  dragItemNewOrder = 0
]) => item => {
  let { order } = item; // Item is out of range. Keep same order

  // Override for items need to be changed
  if (dragItemPrevOrder < dragItemNewOrder) {
    // Drag toward the end
    if (order > dragItemPrevOrder && order <= dragItemNewOrder)
      // Inbetween notes. Replace on one to the start
      order -= 1;
    else if (order === dragItemPrevOrder)
      // Assign new order to the draggable
      order = dragItemNewOrder;
  } else if (dragItemPrevOrder > dragItemNewOrder) {
    // Drag toward the start
    if (order < dragItemPrevOrder && order >= dragItemNewOrder)
      // Inbetween notes. Replace on one to the end
      order += 1;
    else if (order === dragItemPrevOrder)
      // Assign new order to the draggable
      order = dragItemNewOrder;
  }
  return { ...item, order };
};

const updateDragItemOrders = state => ({
  ...state,
  dragItemPrevOrder: state.items[state.dragItemIndex].order,
  dragItemNewOrder: state.items[state.overItemIndex].order
});

const rearrangeItems = fn => state => ({
  ...state,
  isRearranges: true,
  items: map(fn([state.dragItemPrevOrder, state.dragItemNewOrder]), state.items)
});

const resetOverItem = state => {
  state.setOverItem(null);
  return state;
};

const onRearrange = state => {
  state.onRearrange(state);
  return {
    ...state,
    dragItemId: null,
    dragItemIndex: null,
    overItemId: null,
    overItemIndex: null,
    dragItemPrevOrder: null,
    dragItemNewOrder: null
  };
};

export default pipe(
  updateDragItemOrders,
  trace("update drag item orders"),
  rearrangeItems(assignNewOrder),
  trace("rearrange items"),
  resetOverItem,
  trace("reset over item"),
  onRearrange,
  trace("on rearrange")
);
