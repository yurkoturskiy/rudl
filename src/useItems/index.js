import React, { useEffect, useMemo, useReducer, useCallback } from "react";
import reorder from "./reorder";
import init from "./init";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return init(action.payload);
    case "REORDER":
      return reorder({ state, ...action.payload });
    default:
      return state;
  }
};

const actionTemplate = dispatch => type => payload =>
  dispatch({ type, payload });

function useItems({ children, getDraggableItemEvents, cursor }) {
  const [items, dispatch] = useReducer(reducer, [], () =>
    init({ children, getDraggableItemEvents })
  );

  // Actions from template
  const blank = useMemo(() => actionTemplate(dispatch), [dispatch]);
  const updateAction = useMemo(() => blank("UPDATE"), [blank]);
  const reorderAction = useMemo(() => blank("REORDER"), [blank]);

  useEffect(() => {
    // Update items when children changed
    updateAction({ children, getDraggableItemEvents });
  }, [updateAction, children, getDraggableItemEvents]);

  return [items.list, reorderAction];
}

export default useItems;
