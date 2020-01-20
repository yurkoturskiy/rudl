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

const findItemById = (items, id) => items.find(item => item.id === id);

// Validate if index is presented. In case of touch interfaces it is not
const validateItemsParams = ({ state, dragItem, overItem }) => ({
  ...state,
  dragItem: {
    id: dragItem.id,
    index: dragItem.index || findItemById(state.list, dragItem.id).index
  },
  overItem: {
    id: overItem.id,
    index: overItem.index || findItemById(state.list, overItem.id).index
  }
});

const updateDragItemOrders = state => ({
  ...state,
  dragItemPrevOrder: state.list[state.dragItem.index].order,
  dragItemNewOrder: state.list[state.overItem.index].order
});

const rearrangeItems = fn => state => ({
  ...state,
  isRearranges: true,
  list: map(fn([state.dragItemPrevOrder, state.dragItemNewOrder]), state.list)
});

const onRearrange = state => {
  state.onRearrange(state);
  return {
    ...state,
    dragItemPrevOrder: null,
    dragItemNewOrder: null
  };
};

export default pipe(
  validateItemsParams,
  trace("validate items"),
  updateDragItemOrders,
  trace("update drag item orders"),
  rearrangeItems(assignNewOrder),
  trace("rearrange items"),
  onRearrange,
  trace("on rearrange")
);
