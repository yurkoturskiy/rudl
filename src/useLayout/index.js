import React, { useReducer } from "react";
const initState = ({ state } = {}) => ({
  ...state,
  isMount: false,
  wrapperWidth: null,
  // Referenced item as an example of unit's width
  referencedItem: null,
  itemWrapperWidth: null,
  itemWrapperId: null,
  itemWrapperElement: null,
  numOfColumns: null,
  transition: false,
  elements: [],
  width: 0,
  height: 0,
  endline: {
    start: null,
    end: null,
    byColumns: [],
    enterEvent: {
      elementsNum: 0,
      eventHandler: null
    }
  }
});

const reducer = (state, action) => {
};

function useLayout(wrapperWidth, items) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  return state;
}

export default useLayout;
