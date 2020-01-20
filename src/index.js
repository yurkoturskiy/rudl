import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import PropTypes from "prop-types";
// Hooks
import useCursor from "./useCursor/index";
import useItems from "./useItems/index";
import useGhost from "./useGhost/index";
import useGrid from "./useGrid/index";
import useBody from "./useBody";
// Components
import BoundryBox from "./components/BoundryBox";
import Ghost from "./components/Ghost";
import Endline from "./components/Endline";
import Header from "./components/Header";
import ItemComponent from "./components/ItemComponent";
// Loglevel setup
var log = require("loglevel");
log.setLevel("warn");
log.getLogger("useGhost").setLevel("warn");
log.getLogger("useCursor").setLevel("warn");
log.getLogger("useGrid").setLevel("warn");
log.getLogger("useItems").setLevel("warn");
log.getLogger("useBody").setLevel("warn");

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
    children,
    onRearrange
  } = props;
  // Refs
  const masonryLayoutRef = useRef(); // Top wrapper
  const endlineStartRef = useRef(); // Endline start sensor
  const endlineEndRef = useRef(); // Endline end sensor

  const [cursor, getDraggableItemEvents] = useCursor();
  const [items, reorder] = useItems({
    children,
    getDraggableItemEvents,
    cursor,
    transitionDuration,
    onRearrange
  });
  const newGhost = useGhost(cursor, items, {
    ghostTransitionTimingFunction,
    ghostTransitionDuration
  });

  const body = useBody(cursor);

  // useGrid(items, masonryLayoutRef);

  // Ghost
  const [ghost, setGhost] = useState();

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
    const wrapperWidth = masonryLayoutRef.current.offsetWidth;
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
    if (masonryLayoutRef.current.offsetHeight > 0) {
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
    <div className="masonry" ref={masonryLayoutRef}>
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
        {newGhost.isActive && newGhost.component}
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
