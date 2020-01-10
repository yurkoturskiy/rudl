import React, { useEffect, useRef, useState, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import Ghost from "./Ghost";
// Hooks

// Event handlers
import {
  mouseMoveHandler,
  onMouseDown,
  onTouchStart,
  onTouchMove
} from "./utils/eventHandlers";

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
    ghostTransitionTimingFunction
  } = props;

  const generateItems = () =>
    React.Children.map(props.children, (child, index) => {
      if (child.props.separator) {
        return {
          index: index,
          id: child.key,
          order: child.props.order,
          separator: child.props.separator,
          element: child
        };
      }
      return {
        index: index,
        id: child.key,
        order: child.props.order,
        separator: child.props.separator,
        width: child.props.width,
        height: child.props.height,
        element: React.cloneElement(child, {
          ...child.props,
          draggableItem: {
            onMouseDown: onMouseDown(setMouse)(index),
            onMouseEnter: e => onMouseEnterItem(e, index),
            onDragEnd: e => onDragEnd(e, index),
            onTouchStart: onTouchStart(setTouch)(index),
            onTouchMove: onTouchMove(setTouch),
            onTouchEnd: e => onTouchEnd(),
            onClick: e => onClickEvent()
          }
        })
      };
    });
  const [items, setItems] = useState(() => generateItems());
  useEffect(() => {
    setItems(() => generateItems());
  }, [props.children]);
  const [overItemIndex, setOverItemIndex] = useState();
  const [dragItemPrevOrder, setDragItemPrevOrder] = useState();
  const [dragItemNewOrder, setDragItemNewOrder] = useState();
  const [isRearranges, setIsRearranges] = useState(false);
  // Touch events
  const [touch, setTouch] = useState(false);
  const [UILog, setUILog] = useState("");
  // Mouse
  const [mouse, setMouse] = useState();
  // Drag events
  const [drag, setDrag] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState();
  const [preventClick, setPreventClick] = useState();
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

  // Track mouse position only if dragItemIndex is defined
  const onMouseMove = useMemo(() => mouseMoveHandler(setMouse), [setMouse]);
  useEffect(() => {
    mouse &&
      mouse.isDown &&
      document.addEventListener("mousemove", onMouseMove);
    return () => {
      mouse &&
        mouse.isDown &&
        document.removeEventListener("mousemove", onMouseMove);
    };
  }, [mouse, onMouseMove]);

  /////////////////////
  /* Events' methods */
  /////////////////////

  useEffect(() => {
    const reorderReducer = (newOrder, item) => {
      let order = item.order; // Item is out of range. Keep same order

      // Override for items need to be changed
      if (items[dragItemIndex].order < items[overItemIndex].order) {
        // Drag toward the end
        if (
          item.order > items[dragItemIndex].order &&
          item.order <= items[overItemIndex].order
        )
          // Inbetween notes. Replace on one to the start
          order = item.order - 1;
        else if (item.order === items[dragItemIndex].order)
          // Assign new order to the draggable
          order = items[overItemIndex].order;
      } else if (items[dragItemIndex].order > items[overItemIndex].order) {
        // Drag toward the start
        if (
          item.order < items[dragItemIndex].order &&
          item.order >= items[overItemIndex].order
        )
          // Inbetween notes. Replace on one to the end
          order = item.order + 1;
        else if (item.order === items[dragItemIndex].order)
          // Assign new order to the draggable
          order = items[overItemIndex].order;
      }
      return newOrder.concat(order);
    };

    setItems(items => {
      if (
        typeof dragItemIndex === "number" &&
        typeof overItemIndex === "number" &&
        overItemIndex !== dragItemIndex &&
        !isRearranges
      ) {
        setDragItemNewOrder(items[overItemIndex].order);
        const newOrder = items.reduce(reorderReducer, []);
        const newItems = items.map((item, index) => {
          item.order = newOrder[index];
          return item;
        });
        setIsRearranges(true);
        setTimeout(() => {
          // console.log("rearrange is done");
          setIsRearranges(false);
        }, 500);
        return newItems;
      }
      return items;
    });
  }, [overItemIndex, dragItemIndex, items, isRearranges]);

  const cleanupDrag = () => {
    // Mouse
    setMouse(null);
    // Touch
    setTouch(false);
    // Drag
    setDrag(false);
    setDragPoint(null);
    setDragItemIndex(null);
    setOverItemIndex(null);
    // Log
    setUILog("cleanup");
  };

  useEffect(() => {
    if (!touch && !ghost) {
      document.body.style.overflow = bodyDefaultOverflow;
      document.body.style.overscrollBehaviorY = bodyDefaultOverscrollBehaviorY;
    }
  }, [touch, ghost, bodyDefaultOverflow, bodyDefaultOverscrollBehaviorY]);

  //////////////////////////
  /* Touch screens events */
  //////////////////////////

  // Trigger on touch move
  const overElementId = useMemo(
    () =>
      touch &&
      touch.pos &&
      drag &&
      document.elementFromPoint(touch.pos.x, touch.pos.y).id,
    [touch, drag]
  );
  useEffect(() => {
    if (drag && overElementId) {
      const overElementItem = items.find(item => item.id === overElementId);
      setOverItemIndex(overElementItem && overElementItem.index);
    } else {
      touch && touch.pos && clearTimeout(longPress);
      touch && touch.pos && clearTimeout(press);
    }
  }, [drag, items, overElementId, touch]);

  const onTouchEnd = e => {
    setUILog("touch end");
    clearTimeout(press);
    clearTimeout(longPress); // Cancel drag event for touch scn
    cleanupDrag();
    setTouch(false);
  };

  useEffect(() => {
    setBodyDefaultOverflow(document.body.style.overflow);
    setBodyDefaultOverscrollBehaviorY(document.body.style.overscrollBehaviorY);
  }, []);

  //////////////////
  /* Mouse events */
  //////////////////

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

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

  const onMouseUp = e => {
    cleanupDrag();
  };

  const onMouseEnterItem = (e, itemIndex) => setOverItemIndex(itemIndex);

  const onDragEnd = () => {
    // Cleanup after dragging
    cleanupDrag();
  };

  const onClickCapture = e => {
    // Prevent onClick event when dragging
    preventClick && e.stopPropagation();
  };

  useEffect(() => {
    // Set drag
    if (mouse && mouse.isDown && mouse.pos && !drag) {
      // For mouse interface
      if (
        Math.abs(mouse.pos.x - mouse.initialPos.x) >= 3 ||
        Math.abs(mouse.pos.y - mouse.initialPos.y) >= 3
      ) {
        setDrag(true);
        setPreventClick(true);
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

  useEffect(() => {
    // Start dragging
    if (drag && (touch || mouse) && !ghost && !dragPoint) {
      try {
        const dragElementRect = document
          .getElementById(`${items[dragItemIndex].id}-wrapper`)
          .getBoundingClientRect();
        setDragPoint({
          x:
            (touch ? touch.initialPos.x : mouse.initialPos.x) -
            dragElementRect.left,
          y:
            (touch ? touch.initialPos.y : mouse.initialPos.y) -
            dragElementRect.top
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [drag, dragItemIndex, touch, items, ghost, mouse, dragPoint]);

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
    setPreventClick(false);
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
    const cardRefItem = items.find(item => !item.separator);
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
      if (item.separator) {
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

  const onClickEvent = e => {
    // console.log("click");
  };

  const renderItems = items.map((item, index) => {
    // Render eash child
    const newComponent = (
      <div
        className="element-bounding"
        id={`${item.id}-wrapper`}
        key={`${item.id}-wrapper`}
        style={{
          position: "absolute",
          margin: 0,
          padding: 0,
          userSelect: "none",
          top: `${layout.elements[index] ? layout.elements[index].y : 0}px`,
          left: `${layout.elements[index] ? layout.elements[index].x : 0}px`,
          transition: `${
            ghostSourceId !== item.id && transition && layoutIsMount
              ? `top ${transitionDuration}ms ${transitionTimingFunction}, left ${transitionDuration}ms ${transitionTimingFunction}`
              : "none"
          }`,
          visibility:
            layout.elements[index] && layoutIsMount ? "visible" : "hidden",
          opacity: ghost && ghostSourceId === items[index].id ? 0 : 1
        }}
        onLoad={loadHandler}
        onError={errorHandler}
        onClickCapture={onClickCapture}
      >
        {items[index].element}
      </div>
    );
    return newComponent;
  });

  return (
    <div className="masonry" ref={masonryLayout}>
      {props.header && layoutIsMount && (
        <div
          style={{
            position: "relative",
            width: `${layout.width}px`,
            margin: "0 auto 0 auto"
          }}
        >
          {props.header}
        </div>
      )}
      <div
        style={{
          position: "relative",
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          margin: "0 auto 0 auto",
          // outline: "1px solid red",
          transition:
            transition && layoutIsMount
              ? `width ${transitionDuration}ms ${transitionTimingFunction}`
              : "none"
        }}
        className="boundry-box"
      >
        {renderItems}
        {ghost && (
          <Ghost
            x={ghostPos.x}
            y={ghostPos.y}
            drag={drag}
            onGhostEndTransition={onGhostEndTransition}
            ghostTransitionDuration={ghostTransitionDuration}
            ghostTransitionTimingFunction={ghostTransitionTimingFunction}
          >
            {ghost}
          </Ghost>
        )}
        {typeof layout.endline.start.y === "number" && (
          <React.Fragment>
            <div
              id="MasonryLayoutEndlineStart"
              ref={endlineStartRef}
              style={{
                position: "absolute",
                top: `${layout.endline.start.y}px`,
                left: `${layout.endline.start.x}px`
              }}
            />
            <div
              id="MasonryLayoutEndlineEnd"
              ref={endlineEndRef}
              style={{
                position: "absolute",
                top: `${layout.endline.end.y}px`,
                left: `${layout.endline.end.x}px`
              }}
            />
          </React.Fragment>
        )}
      </div>
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
