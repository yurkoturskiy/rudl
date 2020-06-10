import React, { useRef, useEffect, useCallback, useReducer } from "react";
import { curry, pipe } from "ramda";
import createAction from "../utils/createAction";
import logger from "../utils/logger";

const { log } = logger("Endline");

interface State {
  endlineDistanceToTop: number;
  endlineDistanceToViewport: number;
  lastTriggeredNumOfItems: number;
}

const createReferencedAction = curry((dispatch, ref, type, event) =>
  dispatch({ type, payload: { ref, event } })
);

const setEndlineDistanceToTop = ({
  state,
  ref,
}: {
  state: State;
  ref: React.RefObject<HTMLDivElement>;
}): State => {
  const element = ref.current as HTMLDivElement;
  return {
    ...state,
    endlineDistanceToTop: element.getBoundingClientRect().top,
  };
};

const setEndlineDistanceToViewport = (state: State): State => ({
  ...state,
  endlineDistanceToViewport: state.endlineDistanceToTop - window.innerHeight,
});

const handleScroll = pipe(
  setEndlineDistanceToTop,
  setEndlineDistanceToViewport
);

const endlineEnter = ({
  state,
  onEndlineEnter,
  numOfLoadedItems,
}: {
  state: State;
  onEndlineEnter(): void;
  numOfLoadedItems: number;
}): State => {
  onEndlineEnter();
  return { ...state, lastTriggeredNumOfItems: numOfLoadedItems };
};

const initialStateValues: State = {
  endlineDistanceToTop: Infinity,
  endlineDistanceToViewport: Infinity,
  lastTriggeredNumOfItems: 0,
};

const initState = ({ state }: { state?: State } = {}) => ({
  ...state,
  ...initialStateValues,
});

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: State, action: Action) => {
  log.debug("Endline reducer", action.type, state, action.payload);
  switch (action.type) {
    case "SCROLL":
      return handleScroll({ state, ...action.payload });
    case "ENDLINE_ENTER":
      return endlineEnter({ state, ...action.payload });
    default:
      return state;
  }
};

interface Layout {
  numOfItems: number;
  isMount: boolean;
  endlineStartX: number;
  endlineStartY: number;
  endlineEndX: number;
  endlineEndY: number;
}

interface Props {
  layout: Layout;
  onEndlineEnter(): void;
}

const Endline: React.FC<Props> = ({ layout, onEndlineEnter }) => {
  const endlineStartRef = useRef<HTMLDivElement>(null); // Endline start sensor
  const endlineEndRef = useRef<HTMLDivElement>(null); // Endline end sensor
  const [state, dispatch] = useReducer(reducer, initialStateValues);
  const handleScrollEvent = useCallback(
    createReferencedAction(dispatch, endlineStartRef, "SCROLL"),
    []
  );
  const handleEnlineEnter = useCallback(
    createAction(dispatch, "ENDLINE_ENTER"),
    []
  );

  // Endline enter event
  useEffect(() => {
    state.endlineDistanceToViewport <= 0 &&
      state.lastTriggeredNumOfItems !== layout.numOfItems &&
      handleEnlineEnter({
        onEndlineEnter,
        numOfLoadedItems: layout.numOfItems,
      });
  }, [handleEnlineEnter, layout.numOfItems, onEndlineEnter, state]);

  // Scroll event
  useEffect(() => {
    handleScrollEvent();
    layout.isMount && window.addEventListener("scroll", handleScrollEvent);
    return () => {
      layout.isMount && window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [handleScrollEvent, layout.isMount]);

  useEffect(() => log.debug("Endline state update", state), [state]);

  // Render's values
  const startX = layout.endlineStartX;
  const startY = layout.endlineStartY;
  const endX = layout.endlineEndX;
  const endY = layout.endlineEndY;

  return (
    <>
      <div
        id="MasonryLayoutEndlineStart"
        ref={endlineStartRef}
        style={{
          position: "absolute",
          top: `${startY}px`,
          left: `${startX}px`,
        }}
      />
      <div
        id="MasonryLayoutEndlineEnd"
        ref={endlineEndRef}
        style={{
          position: "absolute",
          top: `${endY}px`,
          left: `${endX}px`,
        }}
      />
    </>
  );
};

export default Endline;
