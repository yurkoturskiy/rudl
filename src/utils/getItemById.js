export default function getItemById({ id, items }) {
  // Return object with required id from items array
  let indexOfItem;
  for (var i = 0, len = props.children.length; i < len; i++) {
    if (items[i].id === id) {
      indexOfItem = i;
      break;
    }
  }
  // not support IE8
  // let indexOfItem = items.findIndex(item => item.id === id);
  return items[indexOfItem];
}
