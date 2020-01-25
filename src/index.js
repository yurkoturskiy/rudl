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
import Endline from "./Endline/index";
import Header from "./components/Header";
import ItemComponent from "./components/ItemComponent";
import useResponsiveRef from "./useResponsiveRef";
import useLayout from "./useLayout";
import useLoadHandler from "./useLoadHandler/index";
// Loglevel setup
var log = require("loglevel");
log.setLevel("warn");
log.getLogger("useGhost").setLevel("warn");
log.getLogger("useCursor").setLevel("warn");
log.getLogger("useGrid").setLevel("warn");
log.getLogger("useItems").setLevel("warn");
log.getLogger("useBody").setLevel("warn");
log.getLogger("useLayout").setLevel("trace");
log.getLogger("useLoadHandler").setLevel("warn");
log.getLogger("Endline").setLevel("warn");

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
  const endlineStartRef = useRef(); // Endline start sensor

  const [layoutRef, layoutWrapperWidth] = useResponsiveRef(props.onWidthResize);

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

  const loadHandler = useLoadHandler();

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
        />
      )),
    [
      items,
      newLayout.isMount,
      newLayout.units,
      newLayout.transition,
      transitionDuration,
      transitionTimingFunction,
      ghost.sourceId,
      ghost.isActive,
      loadHandler
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
        {ghost.isActive && <Ghost {...ghost} />}
        {newLayout.isMount && props.onEndlineEnter && (
          <Endline layout={newLayout} onEndlineEnter={props.onEndlineEnter} />
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
