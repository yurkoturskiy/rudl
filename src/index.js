import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import PropTypes from "prop-types";
// Hooks
import useItems from "./useItems/index";
import useCursor from "./useCursor/index";
// Components
import BoundryBox from "./components/BoundryBox";
import Ghost from "./components/Ghost";
import Endline from "./components/Endline";
import Header from "./components/Header";
import ItemComponent from "./components/ItemComponent";

//////////////////////////////
/* Masonry layout component */
//////////////////////////////
var longPress, press, ghostTimeout;
// General
function DraggableMasonryLayout(props) {
  const {
    transitionTimingFunction,
    transitionDuration,
    ghostTransitionDuration,
    ghostTransitionTimingFunction,
    children
  } = props;

  const [cursor, getDraggableItemEvents] = useCursor();

  const [items, reorder] = useItems({
    children,
    getDraggableItemEvents,
    cursor
  });

  const [overItemIndex, setOverItemIndex] = useState(); // cursor instance
  const [dragItemPrevOrder, setDragItemPrevOrder] = useState(); // items instance
  const [dragItemNewOrder, setDragItemNewOrder] = useState(); // items instance
  const [isRearranges, setIsRearranges] = useState(false); // items instance
  // Touch events
  const [touch, setTouch] = useState(false);
  // Mouse
  const [mouse, setMouse] = useState();
  // Drag events
  const [drag, setDrag] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState();
  const [dragPoint, setDragPoint] = useState();
  // Ghost
  const [ghost, setGhost] = useState();
  const [ghostPos, setGhostPos] = useState();
  const [ghostSourceId, setGhostSourceId] = useState();
  // Body
  const [bodyDefaultOverflow, setBodyDefaultOverflow] = useState();
  const [
    bodyDefaultOverscrollBehaviorY,
    setBodyDefaultOverscrollBehaviorY
  ] = useState();

  /////////////////////
  /* Events' methods */
  /////////////////////

  useEffect(() => {
    // Reorder effect
    if (
      typeof dragItemIndex === "number" &&
      typeof overItemIndex === "number" &&
      overItemIndex !== dragItemIndex &&
      !isRearranges
    ) {
      setDragItemNewOrder(items[overItemIndex].order);
      setIsRearranges(true);
      setTimeout(() => {
        // console.log("rearrange is done");
        setIsRearranges(false);
      }, 500);
      reorder({ overItemIndex, dragItemIndex });
    }
  }, [overItemIndex, dragItemIndex, items, isRearranges, reorder]);

  useEffect(() => {
    if (!touch && !ghost) {
      document.body.style.overflow = bodyDefaultOverflow;
      document.body.style.overscrollBehaviorY = bodyDefaultOverscrollBehaviorY;
    }
  }, [touch, ghost, bodyDefaultOverflow, bodyDefaultOverscrollBehaviorY]);

  //////////////////////////
  /* Touch screens events */
  //////////////////////////

  useEffect(() => {
    setBodyDefaultOverflow(document.body.style.overflow);
    setBodyDefaultOverscrollBehaviorY(document.body.style.overscrollBehaviorY);
  }, []);

  //////////////////
  /* Mouse events */
  //////////////////

  useEffect(() => {
    if (
      typeof dragItemPrevOrder === "number" &&
      typeof dragItemNewOrder === "number" &&
      dragItemNewOrder !== dragItemPrevOrder &&
      !drag
    ) {
      // console.log("call on rearrange func");
      props.onRearrange &&
        props.onRearrange(items[dragItemIndex], dragItemNewOrder, items);
      setDragItemPrevOrder(null);
      setDragItemNewOrder(null);
    }
  }, [dragItemNewOrder, dragItemIndex, items, dragItemPrevOrder, props, drag]);

  useEffect(() => {
    // Set drag
    if (mouse && mouse.isDown && mouse.pos && !drag) {
      // For mouse interface
      if (
        Math.abs(mouse.pos.x - mouse.initialPos.x) >= 3 ||
        Math.abs(mouse.pos.y - mouse.initialPos.y) >= 3
      ) {
        setDrag(true);
        setDragItemPrevOrder(items[mouse.itemIndex].order);
        setDragItemIndex(mouse.itemIndex);
      }
    }
    if (touch && !drag) {
      // For touch interface
      press = setTimeout(() => {
        // Temporary disable scroll and pull-down-to-refresh
        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehaviorY = "contain";
      }, 300);
      longPress = // Long press event
        touch.numOfFingers === 1 &&
        setTimeout(() => {
          setDragItemIndex(touch.itemIndex);
          setDrag(true);
        }, 500);
    }
  }, [touch, mouse, drag, items]);

  ////////////
  /* Ghost */
  ///////////
  useEffect(() => {
    // Ghost positioning effect
    if (drag && dragPoint && (touch || mouse)) {
      if (!ghost) {
        // Create ghost
        const sourceId = items[dragItemIndex].id;
        const id = `${sourceId}-ghost`;
        let sourceElement = document.getElementById(sourceId);
        const sourceClassList = sourceElement.classList;
        sourceElement.classList.add("ghost", touch && "touch"); // Add classNames to source to animate styles
        // Set Ghost element
        const newClassNames = `ghost ${touch && "touch"}`;
        const className = `${sourceClassList} ${newClassNames}`;
        const component = React.cloneElement(items[dragItemIndex].element, {
          draggableItem: { id, className }
        }); // Clone source
        setGhost(component);
      }
      !ghostSourceId && setGhostSourceId(items[dragItemIndex].id);
      // Set ghost position to mouse move position
      setGhostPos({
        x: (touch ? touch.pos.x : mouse.pos.x) - dragPoint.x,
        y: (touch ? touch.pos.y : mouse.pos.y) - dragPoint.y
      });
    } else if (!drag && ghost) {
      try {
        // Move ghost to the source position
        const rect = document
          .getElementById(`${ghostSourceId}-wrapper`)
          .getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        setGhostPos({ x, y });
      } catch (err) {
        console.error(err);
      }
      ghostTimeout = setTimeout(() => {
        // If onTransitionEnd event was not triggered
        onGhostEndTransition();
      }, ghostTransitionDuration + 100);
    }
  }, [
    mouse,
    touch,
    drag,
    dragPoint,
    dragItemIndex,
    ghost,
    items,
    ghostSourceId,
    ghostTransitionDuration
  ]);

  const onGhostEndTransition = () => {
    // Turn-off ghost
    clearTimeout(ghostTimeout);
    setGhost(null);
    setGhostPos(null);
  };

  useEffect(() => {
    // Clean source element. Transit to original styles
    if (!ghost && ghostSourceId) {
      document.getElementById(ghostSourceId).classList.remove("ghost", "touch");
      setGhostSourceId(null);
    }
  }, [ghost, ghostSourceId]);

  ////////////////////
  /* Masonry Layout */
  ////////////////////
  const [layoutIsMount, setLayoutIsMount] = useState(false);
  const [columns, setColumns] = useState(0);
  const [transition, setTransition] = useState(false);
  const [layout, setLayout] = useState({
    elements: [],
    width: 0,
    height: 0,
    endline: {
      start: { x: null, y: null },
      end: { x: null, y: null },
      byColumns: [],
      enterEvent: {
        elementsNum: 0,
        eventHandler: props.onEndlineEnter && props.onEndlineEnter
      }
    }
  });
  const [onErrorCount, setOnErrorCount] = useState(0);
  const [onLoadCount, setOnLoadCount] = useState(0);

  const masonryLayout = useRef(); // Top wrapper
  const endlineStartRef = useRef(); // Endline start sensor
  const endlineEndRef = useRef(); // Endline end sensor

  ////////////
  // Resize //
  ////////////
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [isResized, setIsResized] = useState(false);
  const handleResize = evt => setIsResized(true);
  useEffect(() => {
    // Mount and unmount only
    // Add/remove event listeners
    // checkLayout();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const widthIsResized = window.innerWidth !== winWidth;
    if (widthIsResized) {
      props.onWidthResize();
      setWinWidth(window.innerWidth);
    }
    // Check layout
    const wrapperWidth = masonryLayout.current.offsetWidth;
    const cardRefItem = items.find(item => !item.isSeparator);
    const cardWrapperWidth =
      items[0].width ||
      document.getElementById(`${cardRefItem.id}-wrapper`).offsetWidth;
    setColumns(Math.floor(wrapperWidth / cardWrapperWidth));
    // Turn on transition if window resizing
    setTransition(isResized);
    setIsResized(false);
  }, [isResized, items]);

  const handleScroll = e => {
    checkEndlineEnterEvent();
  };

  const checkEndlineEnterEvent = () => {
    setLayout(layout => {
      if (
        endlineStartRef.current &&
        endlineStartRef.current.getBoundingClientRect().top -
          window.innerHeight <=
          0 &&
        layout.endline.enterEvent.elementsNum !== layout.elements.length
      ) {
        // enter endline event
        layout.endline.enterEvent.elementsNum = layout.elements.length;
        // execute enter endline event handler
        layout.endline.enterEvent.eventHandler &&
          layout.endline.enterEvent.eventHandler();
      }
      return layout;
    });
  };

  useEffect(() => {
    // component did mount or update
    if (masonryLayout.current.offsetHeight > 0) {
      // if layout rendered
      setLayoutIsMount(true);
      checkEndlineEnterEvent();
      // setTransition(true);
    }
    layoutIsMount && setTransition(true);
  });

  useEffect(() => {
    // if number of items
    setTransition(() => {
      if (items.length > layout.elements.length) {
        // disable transition for infinite scroll
        return false;
      } else if (items.length === layout.elements.length) {
        // enable for creation or change
        return true;
      } else if (items.length < layout.elements.length) {
        // enable for deletion
        return true;
      }
    });
  }, [items, layout.elements.length]);

  useEffect(() => {
    // set layout
    let elements = [];
    let endline = layout.endline;
    let cardWrapperWidth;
    endline.byColumns = Array(columns).fill(0);
    const itemsSortedByOrder = items.concat().sort((a, b) => a.order - b.order);
    itemsSortedByOrder.forEach((item, index) => {
      // Calculate positions of each element
      const cardWrapperElement = document.getElementById(`${item.id}-wrapper`);
      const height = item.height || cardWrapperElement.offsetHeight;
      cardWrapperWidth = item.width || cardWrapperElement.offsetWidth;
      const cardElement = document.getElementById(item.id);
      const cardWidth = item.width || cardElement.offsetWidth;
      const cardHeight = item.height || cardElement.offsetHeight;
      const cardOffsetLeft = cardElement.offsetLeft;
      const cardOffsetTop = cardElement.offsetTop;
      const leastNum = Math.min(...endline.byColumns);
      const leastNumIndex = endline.byColumns.indexOf(leastNum);
      const maxNum = Math.max(...endline.byColumns);
      const maxNumIndex = endline.byColumns.indexOf(maxNum);
      let x, y;
      if (item.isSeparator) {
        x = 0;
        y = endline.byColumns[maxNumIndex];
        let newLine = endline.byColumns[maxNumIndex] + height;
        endline.byColumns.fill(newLine);
      } else {
        x = leastNumIndex * cardWrapperWidth;
        y = endline.byColumns[leastNumIndex];
        endline.byColumns[leastNumIndex] += height;
      }
      elements[item.index] = {
        x,
        y,
        cardWidth,
        cardHeight,
        cardOffsetLeft,
        cardOffsetTop
      };
    });
    endline.start.x =
      cardWrapperWidth *
      endline.byColumns.indexOf(Math.min(...endline.byColumns));
    endline.start.y = Math.min(...endline.byColumns);
    endline.end.x =
      cardWrapperWidth *
      endline.byColumns.indexOf(Math.max(...endline.byColumns));
    endline.end.y = Math.max(...endline.byColumns);
    setLayout({
      elements: elements, // list of all elements with coorditares
      width: cardWrapperWidth * columns, // width of the whole layout
      height: endline.end.y, // height of the whole layout
      endline: endline
    });
  }, [columns, onLoadCount, onErrorCount, items, layout.endline]);

  const errorHandler = index => {
    setOnErrorCount(onErrorCount + 1);
    console.log("can't load: ", index);
  };

  const loadHandler = index => setOnLoadCount(onLoadCount + 1);

  const renderItems = useMemo(
    () =>
      items.map((item, index) => (
        <ItemComponent
          item={item}
          key={`${item.id}-wrapper`}
          layoutElement={layout.elements[index]}
          transition={transition}
          layoutIsMount={layoutIsMount}
          transitionDuration={transitionDuration}
          transitionTimingFunction={transitionTimingFunction}
          ghost={ghost}
          loadHandler={loadHandler}
          errorHandler={errorHandler}
        />
      )),
    [
      ghost,
      items,
      layout.elements,
      layoutIsMount,
      transition,
      transitionDuration,
      transitionTimingFunction
    ]
  );

  return (
    <div className="masonry" ref={masonryLayout}>
      {props.header && layoutIsMount && (
        <Header width={layout.width} component={props.header} />
      )}
      <BoundryBox
        width={layout.width}
        height={layout.height}
        transitionDuration={transitionDuration}
        transitionTimingFunction={transitionTimingFunction}
        transition={transition}
        layoutIsMount={layoutIsMount}
      >
        {renderItems}
        {ghost && (
          <Ghost
            x={ghostPos.x}
            y={ghostPos.y}
            drag={drag}
            component={ghost}
            onGhostEndTransition={onGhostEndTransition}
            ghostTransitionDuration={ghostTransitionDuration}
            ghostTransitionTimingFunction={ghostTransitionTimingFunction}
          />
        )}
        {typeof layout.endline.start.y === "number" && (
          <Endline
            startRef={endlineStartRef}
            endRef={endlineEndRef}
            startX={layout.endline.start.x}
            startY={layout.endline.start.y}
            endX={layout.endline.end.x}
            endY={layout.endline.end.y}
          />
        )}
      </BoundryBox>
    </div>
  );
}

DraggableMasonryLayout.propTypes = {
  header: PropTypes.element,
  children: PropTypes.element,
  reverse: PropTypes.bool,
  onEndlineEnter: PropTypes.func,
  onRearrange: PropTypes.func,
  onWidthResize: PropTypes.func,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  ghostTransitionDuration: PropTypes.number,
  ghostTransitionTimingFunction: PropTypes.string
};

DraggableMasonryLayout.defaultProps = {
  transitionDuration: 600,
  transitionTimingFunction: "ease",
  ghostTransitionDuration: 200,
  ghostTransitionTimingFunction: "ease"
};

export default DraggableMasonryLayout;
