import { pipe, update, adjust } from "ramda";

const setItems = items => state => ({
  ...state,
  prevNumOfItems: state.numOfItems,
  numOfItems: items.length,
  itemsSortedByOrder: items.concat().sort((a, b) => a.order - b.order),
  referencedItem: items.find(item => !item.isSeparator)
});

const setItemWrapperId = state => ({
  ...state,
  itemWrapperId: `${state.referencedItem.id}-wrapper`
});

const setWrapperWidth = wrapperWidth => state => ({
  ...state,
  wrapperWidth
});

const setItemWrapperElement = state => ({
  ...state,
  itemWrapperElement: document.getElementById(state.itemWrapperId)
});

const setItemWrapperWidth = state => ({
  ...state,
  itemWrapperWidth:
    state.referencedItem.width || state.itemWrapperElement.offsetWidth
});

const setNumOfColumns = state => ({
  ...state,
  numOfColumns: Math.floor(state.wrapperWidth / state.itemWrapperWidth)
});

const initEndlinePerColumn = state => ({
  ...state,
  endlinePerColumn: Array(state.numOfColumns).fill(0)
});

// SET LAYOUT UNITS

const setUnitItem = item => ({ item });
const setUnitItemAndWrapperElements = unit => ({
  ...unit,
  itemElement: document.getElementById(unit.item.id),
  itemWrapperElement: document.getElementById(`${unit.item.id}-wrapper`)
});
const setUnitSizes = unit => ({
  ...unit,
  // Item sizes
  itemWidth: unit.item.width || unit.itemElement.offsetWidth,
  itemHeight: unit.item.height || unit.itemElement.offsetHeight,
  itemOffsetLeft: unit.itemElement.offsetLeft,
  itemOffsetTop: unit.itemElement.offsetTop,
  // Item wrapper sizes
  itemWrapperHeight: unit.item.height || unit.itemWrapperElement.offsetHeight,
  itemWrapperWidth: unit.item.width || unit.itemWrapperElement.offsetWidth
});

const getLongestColumnSize = endlinePerColumn => Math.max(...endlinePerColumn);
const getLongestColumnIndex = endlinePerColumn =>
  endlinePerColumn.indexOf(Math.max(...endlinePerColumn));

// Set unit x coord
const separatorCoordinates = (unit, endlinePerColumn) => {
  const longestColumnSize = getLongestColumnSize(endlinePerColumn);
  const longestColumnIndex = getLongestColumnIndex(endlinePerColumn);
  const newLine = longestColumnSize + unit.itemWrapperHeight;
  return {
    ...unit,
    x: 0,
    y: endlinePerColumn[longestColumnIndex],
    endlinePerColumn: endlinePerColumn.concat().fill(newLine)
  };
};

const getShortestColumnSize = endlinePerColumn => Math.min(...endlinePerColumn);
const getShortestColumnIndex = endlinePerColumn =>
  endlinePerColumn.indexOf(Math.min(...endlinePerColumn));

const itemCoordinates = (unit, endlinePerColumn) => {
  const shortestColumnIndex = getShortestColumnIndex(endlinePerColumn);
  return {
    ...unit,
    x: shortestColumnIndex * unit.itemWrapperWidth,
    y: endlinePerColumn[shortestColumnIndex],
    endlinePerColumn: adjust(
      shortestColumnIndex,
      size => size + unit.itemWrapperHeight,
      endlinePerColumn
    )
  };
};

const setCoordinates = endlinePerColumn => unit =>
  unit.item.isSeparator
    ? separatorCoordinates(unit, endlinePerColumn)
    : itemCoordinates(unit, endlinePerColumn);

const createUnitFromItem = endlinePerColumn =>
  pipe(
    setUnitItem,
    setUnitItemAndWrapperElements,
    setUnitSizes,
    setCoordinates(endlinePerColumn)
  );

const accumulateUnits = (acc, item) => {
  const unit = createUnitFromItem(acc.endlinePerColumn)(item);
  return {
    ...acc,
    units: update(item.index, unit, acc.units),
    endlinePerColumn: unit.endlinePerColumn
  };
};

const setUnits = state => ({
  ...state,
  ...state.itemsSortedByOrder.reduce(accumulateUnits, {
    units: Array(state.itemsSortedByOrder.length),
    endlinePerColumn: state.endlinePerColumn
  })
});

const updateEndline = state => ({
  ...state,
  endlineStartX:
    state.itemWrapperWidth * getShortestColumnIndex(state.endlinePerColumn),
  endlineStartY: getShortestColumnSize(state.endlinePerColumn),
  endlineEndX:
    state.itemWrapperWidth * getLongestColumnIndex(state.endlinePerColumn),
  endlineEndY: getLongestColumnSize(state.endlinePerColumn)
});

const setLayoutSize = state => ({
  ...state,
  height: state.endlineEndY,
  width: state.itemWrapperWidth * state.numOfColumns
});

const setMountAndTransition = state => ({
  ...state,
  isMount: true,
  transition: state.isMount
});

export default (state, items, wrapperWidth) =>
  pipe(
    setItems(items),
    setItemWrapperId,
    setWrapperWidth(wrapperWidth),
    setItemWrapperElement,
    setItemWrapperWidth,
    setNumOfColumns,
    initEndlinePerColumn,
    setUnits,
    updateEndline,
    setLayoutSize,
    setMountAndTransition
  )(state);

