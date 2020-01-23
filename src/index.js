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
import useBody from "./useBody";
// Components
import BoundryBox from "./components/BoundryBox";
import Ghost from "./components/Ghost";
import Endline from "./components/Endline";
import Header from "./components/Header";
import ItemComponent from "./components/ItemComponent";
import useResponsiveRef from "./useResponsiveRef";
import useLayout from "./useLayout";
// Loglevel setup
var log = require("loglevel");
log.setLevel("warn");
log.getLogger("useGhost").setLevel("warn");
log.getLogger("useCursor").setLevel("warn");
log.getLogger("useGrid").setLevel("warn");
log.getLogger("useItems").setLevel("warn");
log.getLogger("useBody").setLevel("warn");
log.getLogger("useLayout").setLevel("trace");

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
  const { items } = useItems({
    children,
    getDraggableItemEvents,
    cursor,
    transitionDuration,
    onRearrange
  });
  const ghost = useGhost(cursor, items, {
    ghostTransitionTimingFunction,
    ghostTransitionDuration
  });

  const body = useBody(cursor);
  const [layoutRef, layoutWrapperWidth] = useResponsiveRef();
  const newLayout = useLayout(layoutWrapperWidth, items);

  ////////////////////
  /* Masonry Layout */
  ////////////////////
  const [layoutIsMount, setLayoutIsMount] = useState(false);
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
  useEffect(() => {
    // Mount and unmount only
    // Add/remove event listeners
    // checkLayout();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    if (1000 > 0) {
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
          layoutElement={newLayout.isMount && newLayout.units[index]}
          transition={newLayout.transition}
          layoutIsMount={newLayout.isMount}
          transitionDuration={transitionDuration}
          transitionTimingFunction={transitionTimingFunction}
          ghostSourceId={ghost.sourceId}
          ghostIsActive={ghost.isActive}
          loadHandler={loadHandler}
          errorHandler={errorHandler}
        />
      )),
    [
      ghost.isActive,
      ghost.source,
      items,
      newLayout.units,
      newLayout.isMount,
      transition,
      transitionDuration,
      transitionTimingFunction
    ]
  );

  return (
    <div className="masonry" ref={layoutRef}>
      {/*<div ref={masonryLayoutRef} /> */}
      {props.header && newLayout.isMount && (
        <Header width={newLayout.width} component={props.header} />
      )}
      <BoundryBox
        width={newLayout.width}
        height={newLayout.height}
        transitionDuration={transitionDuration}
        transitionTimingFunction={transitionTimingFunction}
        transition={newLayout.transition}
        layoutIsMount={newLayout.isMount}
      >
        {renderItems}
        {ghost.isActive && ghost.component}
        {typeof newLayout.endlineStartY === "number" && (
          <Endline
            startRef={endlineStartRef}
            endRef={endlineEndRef}
            startX={newLayout.endlineStartX}
            startY={newLayout.endlineStartY}
            endX={newLayout.endlineEndX}
            endY={newLayout.endlineEndY}
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
