"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Ghost(props) {
  var ghostTransitionDuration = props.ghostTransitionDuration,
      ghostTransitionTimingFunction = props.ghostTransitionTimingFunction;
  return _react["default"].createElement("div", {
    style: {
      position: "fixed",
      visibility: "visible",
      left: props.x,
      top: props.y,
      pointerEvents: "none",
      transition: props.drag ? "none" : "left ".concat(ghostTransitionDuration, "ms ").concat(ghostTransitionTimingFunction, ", top ").concat(ghostTransitionDuration, "ms ").concat(ghostTransitionTimingFunction)
    },
    onTransitionEnd: function onTransitionEnd() {
      return props.onGhostEndTransition();
    }
  }, props.children);
}

var _default = Ghost;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Ghost = _interopRequireDefault(require("./Ghost"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//////////////////////////////

/* Masonry layout component */
//////////////////////////////
var longPress, press, ghostTimeout;

function DraggableMasonryLayout(props) {
  var transitionTimingFunction = props.transitionTimingFunction,
      transitionDuration = props.transitionDuration,
      ghostTransitionDuration = props.ghostTransitionDuration,
      ghostTransitionTimingFunction = props.ghostTransitionTimingFunction;

  var generateItems = function generateItems() {
    return _react["default"].Children.map(props.children, function (child, index) {
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
        element: _react["default"].cloneElement(child, _objectSpread({}, child.props, {
          draggableItem: {
            onMouseDown: function onMouseDown(e) {
              return _onMouseDown(e, index);
            },
            onMouseEnter: function onMouseEnter(e) {
              return onMouseEnterItem(e, index);
            },
            onDragEnd: function onDragEnd(e) {
              return _onDragEnd(e, index);
            },
            onTouchStart: function onTouchStart(e) {
              return _onTouchStart(e, index);
            },
            onTouchMove: function onTouchMove(e) {
              return _onTouchMove(e, index);
            },
            onTouchEnd: function onTouchEnd(e) {
              return _onTouchEnd();
            },
            onClick: function onClick(e) {
              return onClickEvent();
            }
          }
        }))
      };
    });
  }; // General


  var _useState = (0, _react.useState)(function () {
    return generateItems();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      items = _useState2[0],
      setItems = _useState2[1];

  (0, _react.useEffect)(function () {
    setItems(function () {
      return generateItems();
    });
  }, [props.children]);

  var _useState3 = (0, _react.useState)(undefined),
      _useState4 = _slicedToArray(_useState3, 2),
      overItemIndex = _useState4[0],
      setOverItemIndex = _useState4[1];

  var _useState5 = (0, _react.useState)(undefined),
      _useState6 = _slicedToArray(_useState5, 2),
      dragItemPrevOrder = _useState6[0],
      setDragItemPrevOrder = _useState6[1];

  var _useState7 = (0, _react.useState)(undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      dragItemNewOrder = _useState8[0],
      setDragItemNewOrder = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isRearranges = _useState10[0],
      setIsRearranges = _useState10[1]; // Touch events


  var _useState11 = (0, _react.useState)(false),
      _useState12 = _slicedToArray(_useState11, 2),
      touch = _useState12[0],
      setTouch = _useState12[1];

  var _useState13 = (0, _react.useState)(),
      _useState14 = _slicedToArray(_useState13, 2),
      touchPos = _useState14[0],
      setTouchPos = _useState14[1];

  var _useState15 = (0, _react.useState)(),
      _useState16 = _slicedToArray(_useState15, 2),
      touchFingers = _useState16[0],
      setTouchFingers = _useState16[1];

  var _useState17 = (0, _react.useState)(),
      _useState18 = _slicedToArray(_useState17, 2),
      firstTouchPos = _useState18[0],
      setFirstTouchPos = _useState18[1];

  var _useState19 = (0, _react.useState)(""),
      _useState20 = _slicedToArray(_useState19, 2),
      UILog = _useState20[0],
      setUILog = _useState20[1]; // Mouse


  var _useState21 = (0, _react.useState)(),
      _useState22 = _slicedToArray(_useState21, 2),
      mousePos = _useState22[0],
      setMousePos = _useState22[1];

  var _useState23 = (0, _react.useState)(false),
      _useState24 = _slicedToArray(_useState23, 2),
      mouseDown = _useState24[0],
      setMouseDown = _useState24[1];

  var _useState25 = (0, _react.useState)(),
      _useState26 = _slicedToArray(_useState25, 2),
      mouseDownPos = _useState26[0],
      setMouseDownPos = _useState26[1]; // Drag events


  var _useState27 = (0, _react.useState)(false),
      _useState28 = _slicedToArray(_useState27, 2),
      drag = _useState28[0],
      setDrag = _useState28[1];

  var _useState29 = (0, _react.useState)(),
      _useState30 = _slicedToArray(_useState29, 2),
      dragItemIndex = _useState30[0],
      setDragItemIndex = _useState30[1];

  var _useState31 = (0, _react.useState)(),
      _useState32 = _slicedToArray(_useState31, 2),
      preventClick = _useState32[0],
      setPreventClick = _useState32[1];

  var _useState33 = (0, _react.useState)(),
      _useState34 = _slicedToArray(_useState33, 2),
      dragPoint = _useState34[0],
      setDragPoint = _useState34[1]; // Ghost


  var _useState35 = (0, _react.useState)(),
      _useState36 = _slicedToArray(_useState35, 2),
      ghost = _useState36[0],
      setGhost = _useState36[1];

  var _useState37 = (0, _react.useState)(),
      _useState38 = _slicedToArray(_useState37, 2),
      ghostPos = _useState38[0],
      setGhostPos = _useState38[1];

  var _useState39 = (0, _react.useState)(),
      _useState40 = _slicedToArray(_useState39, 2),
      ghostSourceId = _useState40[0],
      setGhostSourceId = _useState40[1]; // Body


  var _useState41 = (0, _react.useState)(),
      _useState42 = _slicedToArray(_useState41, 2),
      bodyDefaultOverflow = _useState42[0],
      setBodyDefaultOverflow = _useState42[1];

  var _useState43 = (0, _react.useState)(),
      _useState44 = _slicedToArray(_useState43, 2),
      bodyDefaultOverscrollBehaviorY = _useState44[0],
      setBodyDefaultOverscrollBehaviorY = _useState44[1]; /////////////////////

  /* Events' methods */
  /////////////////////


  var getItemById = function getItemById(id) {
    // Return object with required id from items array
    var indexOfItem;

    for (var i = 0, len = props.children.length; i < len; i++) {
      if (items[i].id === id) {
        indexOfItem = i;
        break;
      }
    } // not support IE8
    // let indexOfItem = items.findIndex(item => item.id === id);


    return items[indexOfItem];
  };

  (0, _react.useEffect)(function () {
    var newItems;
    var newOrder = [];
    setItems(function (items) {
      if (dragItemIndex !== undefined && overItemIndex !== undefined && overItemIndex !== dragItemIndex && !isRearranges) {
        // console.log("rearrange");
        // console.log("drag item order", items[dragItemIndex].order);
        // console.log("drag item new order", items[overItemIndex].order);
        setDragItemNewOrder(items[overItemIndex].order);
        items.forEach(function (item, index) {
          newOrder[index] = item.order; // Item is out of range. Keep same order
          // Override for items need to be changed

          if (items[dragItemIndex].order < items[overItemIndex].order) {
            // Drag toward the end
            if (item.order > items[dragItemIndex].order && item.order <= items[overItemIndex].order) // Inbetween notes. Replace on one to the start
              newOrder[index] = item.order - 1;
            if (item.order === items[dragItemIndex].order) // Assign new order to the draggable
              newOrder[index] = items[overItemIndex].order;
          }

          if (items[dragItemIndex].order > items[overItemIndex].order) {
            // Drag toward the start
            if (item.order < items[dragItemIndex].order && item.order >= items[overItemIndex].order) // Inbetween notes. Replace on one to the end
              newOrder[index] = item.order + 1;
            if (item.order === items[dragItemIndex].order) // Assign new order to the draggable
              newOrder[index] = items[overItemIndex].order;
          }
        });
        newItems = items.map(function (item, index) {
          item.order = newOrder[index];
          return item;
        });
        setIsRearranges(true);
        setTimeout(function () {
          // console.log("rearrange is done");
          setIsRearranges(false);
        }, 500);
        return newItems;
      }

      return items;
    });
  }, [overItemIndex, dragItemIndex, items, isRearranges]);

  var cleanupDrag = function cleanupDrag() {
    // Mouse
    setMouseDown(false);
    setMousePos(undefined); // Touch

    setTouch(false);
    setTouchPos(undefined);
    setFirstTouchPos(undefined); // Drag

    setDrag(false);
    setDragPoint(undefined);
    setDragItemIndex(undefined);
    setOverItemIndex(undefined); // Log

    setUILog("cleanup");
  };

  (0, _react.useEffect)(function () {
    if (!touch && !ghost) {
      document.body.style.overflow = bodyDefaultOverflow;
      document.body.style.overscrollBehaviorY = bodyDefaultOverscrollBehaviorY;
    }
  }, [touch, ghost]); //////////////////////////

  /* Touch screens events */
  //////////////////////////

  var _onTouchStart = function _onTouchStart(e, itemIndex) {
    e.preventDefault();
    e.stopPropagation();
    var touchX = e.touches[0].clientX;
    var touchY = e.touches[0].clientY;
    setTouch(true);
    setTouchFingers(e.touches.length);
    setFirstTouchPos({
      x: touchX,
      y: touchY
    });
    setTouchPos({
      x: touchX,
      y: touchY
    });
    setDragItemIndex(itemIndex);
  };

  var _onTouchMove = function _onTouchMove(e, itemIndex) {
    e.preventDefault();
    e.stopPropagation();
    var touchX = e.touches[0].clientX;
    var touchY = e.touches[0].clientY;
    setDrag(function (drag) {
      !drag && clearTimeout(longPress);
      !drag && clearTimeout(press);

      if (drag) {
        var overElementId = document.elementFromPoint(touchX, touchY).id;
        var overElementItem = getItemById(overElementId);
        setOverItemIndex(overElementItem && overElementItem.index);
      }

      return drag;
    });
    setTouchPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }); // setOverItemIndex(itemIndex);
  };

  var _onTouchEnd = function _onTouchEnd(e) {
    setUILog("touch end");
    clearTimeout(press);
    clearTimeout(longPress); // Cancel drag event for touch scn

    cleanupDrag();
    setTouch(false);
  };

  (0, _react.useEffect)(function () {
    setBodyDefaultOverflow(document.body.style.overflow);
    setBodyDefaultOverscrollBehaviorY(document.body.style.overscrollBehaviorY);
  }, []); //////////////////

  /* Mouse events */
  //////////////////

  (0, _react.useEffect)(function () {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (dragItemPrevOrder !== undefined && dragItemNewOrder !== undefined && dragItemNewOrder !== dragItemPrevOrder && !drag) {
      // console.log("call on rearrange func");
      props.onRearrange && props.onRearrange(items[dragItemIndex], dragItemNewOrder, items);
      setDragItemPrevOrder(undefined);
      setDragItemNewOrder(undefined);
    }
  }, [dragItemNewOrder, dragItemIndex, items, dragItemPrevOrder, props, drag]);

  var onMouseUp = function onMouseUp(e) {
    cleanupDrag();
  };

  var _onMouseDown = function _onMouseDown(e, itemIndex) {
    var freshTouch;
    setTouch(function (touch) {
      freshTouch = touch;
      return touch;
    });
    freshTouch && e.preventDefault();
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
    setMouseDown(true);
    setMouseDownPos({
      x: e.clientX,
      y: e.clientY
    });
    setPreventClick(false);
    setDragItemIndex(itemIndex);
  };

  var onMouseEnterItem = function onMouseEnterItem(e, itemIndex) {
    setOverItemIndex(itemIndex);
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  var onMouseMove = function onMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragItemIndex(function (dragItemIndex) {
      setMousePos(function (mousePos) {
        return dragItemIndex !== undefined ? {
          x: e.clientX,
          y: e.clientY
        } : mousePos;
      });
      return dragItemIndex;
    });
  };

  var _onDragEnd = function _onDragEnd() {
    // Cleanup after dragging
    cleanupDrag();
  };

  var onClickCapture = function onClickCapture(e) {
    // Prevent onClick event when dragging
    preventClick && e.stopPropagation();
  };

  (0, _react.useEffect)(function () {
    // Set drag
    if (mouseDown && !drag) {
      // For mouse interface
      if (Math.abs(mousePos.x - mouseDownPos.x) >= 3 || Math.abs(mousePos.y - mouseDownPos.y) >= 3) {
        setDrag(true);
        setPreventClick(true);
        setDragItemPrevOrder(items[dragItemIndex].order);
      }
    }

    if (touch && !drag) {
      // For touch interface
      press = setTimeout(function () {
        // Temporary disable scroll and pull-down-to-refresh
        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehaviorY = "contain";
      }, 300);
      longPress = // Long press event
      touchFingers === 1 && setTimeout(function () {
        setDrag(true);
      }, 500);
    }
  }, [touch, touchFingers, mouseDown, drag, mouseDownPos, mousePos]);
  (0, _react.useEffect)(function () {
    // Start dragging
    if (drag && !ghost && !dragPoint) {
      try {
        var dragElementRect = document.getElementById("".concat(items[dragItemIndex].id, "-wrapper")).getBoundingClientRect();
        setDragPoint({
          x: (touch ? firstTouchPos.x : mouseDownPos.x) - dragElementRect.left,
          y: (touch ? firstTouchPos.y : mouseDownPos.y) - dragElementRect.top
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [drag, dragItemIndex, firstTouchPos, mouseDownPos, touch, items, ghost]); ////////////

  /* Ghost */
  ///////////

  (0, _react.useEffect)(function () {
    // Ghost positioning effect
    if (drag && dragPoint && (touchPos || mousePos)) {
      if (!ghost) {
        // Create ghost
        var sourceId = items[dragItemIndex].id;
        var id = "".concat(sourceId, "-ghost");
        var sourceElement = document.getElementById(sourceId);
        var sourceClassList = sourceElement.classList;
        sourceElement.classList.add("ghost", touch && "touch"); // Add classNames to source to animate styles
        // Set Ghost element

        var newClassNames = "ghost ".concat(touch && "touch");
        var className = "".concat(sourceClassList, " ").concat(newClassNames);

        var component = _react["default"].cloneElement(items[dragItemIndex].element, {
          draggableItem: {
            id: id,
            className: className
          }
        }); // Clone source


        setGhost(component);
      }

      !ghostSourceId && setGhostSourceId(items[dragItemIndex].id); // Set ghost position to mouse move position

      setGhostPos({
        x: (touch ? touchPos.x : mousePos.x) - dragPoint.x,
        y: (touch ? touchPos.y : mousePos.y) - dragPoint.y
      });
    } else if (!drag && ghost) {
      try {
        // Move ghost to the source position
        var rect = document.getElementById("".concat(ghostSourceId, "-wrapper")).getBoundingClientRect();
        var x = rect.left;
        var y = rect.top;
        setGhostPos({
          x: x,
          y: y
        });
      } catch (err) {
        console.error(err);
      }

      ghostTimeout = setTimeout(function () {
        // If onTransitionEnd event was not triggered
        onGhostEndTransition();
      }, ghostTransitionDuration + 100);
    }
  }, [mousePos, touchPos, touch, drag, dragPoint, dragItemIndex, ghost, items]);

  var onGhostEndTransition = function onGhostEndTransition() {
    // Turn-off ghost
    clearTimeout(ghostTimeout);
    setGhost(undefined);
    setGhostPos(undefined);
  };

  (0, _react.useEffect)(function () {
    // Clean source element. Transit to original styles
    if (!ghost && ghostSourceId) {
      document.getElementById(ghostSourceId).classList.remove("ghost", "touch");
      setGhostSourceId(undefined);
    }
  }, [ghost]); ////////////////////

  /* Masonry Layout */
  ////////////////////

  var _useState45 = (0, _react.useState)(false),
      _useState46 = _slicedToArray(_useState45, 2),
      layoutIsMount = _useState46[0],
      setLayoutIsMount = _useState46[1];

  var _useState47 = (0, _react.useState)(0),
      _useState48 = _slicedToArray(_useState47, 2),
      columns = _useState48[0],
      setColumns = _useState48[1];

  var _useState49 = (0, _react.useState)(false),
      _useState50 = _slicedToArray(_useState49, 2),
      transition = _useState50[0],
      setTransition = _useState50[1];

  var _useState51 = (0, _react.useState)({
    elements: [],
    width: 0,
    height: 0,
    endline: {
      start: {
        x: undefined,
        y: undefined
      },
      end: {
        x: undefined,
        y: undefined
      },
      byColumns: [],
      enterEvent: {
        elementsNum: 0,
        eventHandler: props.onEndlineEnter && props.onEndlineEnter
      }
    }
  }),
      _useState52 = _slicedToArray(_useState51, 2),
      layout = _useState52[0],
      setLayout = _useState52[1];

  var _useState53 = (0, _react.useState)(0),
      _useState54 = _slicedToArray(_useState53, 2),
      onErrorCount = _useState54[0],
      setOnErrorCount = _useState54[1];

  var _useState55 = (0, _react.useState)(0),
      _useState56 = _slicedToArray(_useState55, 2),
      onLoadCount = _useState56[0],
      setOnLoadCount = _useState56[1];

  var masonryLayout = (0, _react.useRef)(); // Top wrapper

  var endlineStartRef = (0, _react.useRef)(); // Endline start sensor

  var endlineEndRef = (0, _react.useRef)(); // Endline end sensor
  ////////////
  // Resize //
  ////////////

  var _useState57 = (0, _react.useState)(window.innerWidth),
      _useState58 = _slicedToArray(_useState57, 2),
      winWidth = _useState58[0],
      setWinWidth = _useState58[1];

  var _useState59 = (0, _react.useState)(false),
      _useState60 = _slicedToArray(_useState59, 2),
      isResized = _useState60[0],
      setIsResized = _useState60[1];

  var handleResize = function handleResize(evt) {
    return setIsResized(true);
  };

  (0, _react.useEffect)(function () {
    // Mount and unmount only
    // Add/remove event listeners
    // checkLayout();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return function () {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  (0, _react.useEffect)(function () {
    var widthIsResized = window.innerWidth !== winWidth;

    if (widthIsResized) {
      props.onWidthResize();
      setWinWidth(window.innerWidth);
    } // Check layout


    var wrapperWidth = masonryLayout.current.offsetWidth;
    var cardRefItem;

    for (var i = 0; i < items.length; i++) {
      if (!items[i].separator) {
        cardRefItem = items[i];
        break;
      }
    }

    var cardWrapperWidth = items[0].width || document.getElementById("".concat(cardRefItem.id, "-wrapper")).offsetWidth;
    setColumns(Math.floor(wrapperWidth / cardWrapperWidth)); // turn on transition if window resizing

    setTransition(isResized);
    setIsResized(false);
  }, [isResized, items]);

  var handleScroll = function handleScroll(e) {
    checkEndlineEnterEvent();
  };

  var checkEndlineEnterEvent = function checkEndlineEnterEvent() {
    setLayout(function (layout) {
      if (endlineStartRef.current && endlineStartRef.current.getBoundingClientRect().top - window.innerHeight <= 0 && layout.endline.enterEvent.elementsNum !== layout.elements.length) {
        // enter endline event
        layout.endline.enterEvent.elementsNum = layout.elements.length; // execute enter endline event handler

        layout.endline.enterEvent.eventHandler && layout.endline.enterEvent.eventHandler();
      }

      return layout;
    });
  };

  (0, _react.useEffect)(function () {
    // component did mount or update
    if (masonryLayout.current.offsetHeight > 0) {
      // if layout rendered
      setLayoutIsMount(true);
      checkEndlineEnterEvent(); // setTransition(true);
    }

    layoutIsMount && setTransition(true);
  });
  (0, _react.useEffect)(function () {
    // if number of items
    setTransition(function () {
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
  (0, _react.useEffect)(function () {
    // set layout
    var elements = [];
    var endline = layout.endline;
    var cardWrapperWidth;
    endline.byColumns = [];

    for (var i = 0; i < columns; i++) {
      endline.byColumns[i] = 0;
    }

    var itemsSortedByOrder = items.concat().sort(function (a, b) {
      return a.order - b.order;
    });
    itemsSortedByOrder.forEach(function (item, index) {
      // Calculate positions of each element
      var cardWrapperElement = document.getElementById("".concat(item.id, "-wrapper"));
      var height = item.height || cardWrapperElement.offsetHeight;
      cardWrapperWidth = item.width || cardWrapperElement.offsetWidth;
      var cardElement = document.getElementById(item.id);
      var cardWidth = item.width || cardElement.offsetWidth;
      var cardHeight = item.height || cardElement.offsetHeight;
      var cardOffsetLeft = cardElement.offsetLeft;
      var cardOffsetTop = cardElement.offsetTop;
      var leastNum = Math.min.apply(Math, _toConsumableArray(endline.byColumns));
      var leastNumIndex = endline.byColumns.indexOf(leastNum);
      var maxNum = Math.max.apply(Math, _toConsumableArray(endline.byColumns));
      var maxNumIndex = endline.byColumns.indexOf(maxNum);
      var x, y;

      if (item.separator) {
        x = 0;
        y = endline.byColumns[maxNumIndex];
        var newLine = endline.byColumns[maxNumIndex] + height;
        endline.byColumns.fill(newLine);
      } else {
        x = leastNumIndex * cardWrapperWidth;
        y = endline.byColumns[leastNumIndex];
        endline.byColumns[leastNumIndex] += height;
      }

      elements[item.index] = {
        x: x,
        y: y,
        cardWidth: cardWidth,
        cardHeight: cardHeight,
        cardOffsetLeft: cardOffsetLeft,
        cardOffsetTop: cardOffsetTop
      };
    });
    endline.start.x = cardWrapperWidth * endline.byColumns.indexOf(Math.min.apply(Math, _toConsumableArray(endline.byColumns)));
    endline.start.y = Math.min.apply(Math, _toConsumableArray(endline.byColumns));
    endline.end.x = cardWrapperWidth * endline.byColumns.indexOf(Math.max.apply(Math, _toConsumableArray(endline.byColumns)));
    endline.end.y = Math.max.apply(Math, _toConsumableArray(endline.byColumns));
    setLayout({
      elements: elements,
      // list of all elements with coorditares
      width: cardWrapperWidth * columns,
      // width of the whole layout
      height: endline.end.y,
      // height of the whole layout
      endline: endline
    });
  }, [columns, onLoadCount, onErrorCount, items, layout.endline]);

  var errorHandler = function errorHandler(index) {
    setOnErrorCount(onErrorCount + 1);
    console.log("can't load: ", index);
  };

  var loadHandler = function loadHandler(index) {
    setOnLoadCount(onLoadCount + 1);
  };

  var onClickEvent = function onClickEvent(e) {// console.log("click");
  };

  var renderItems = items.map(function (item, index) {
    // Render eash child
    var newComponent = _react["default"].createElement("div", {
      className: "element-bounding",
      id: "".concat(item.id, "-wrapper"),
      key: "".concat(item.id, "-wrapper"),
      style: {
        position: "absolute",
        margin: 0,
        padding: 0,
        userSelect: "none",
        top: "".concat(layout.elements[index] ? layout.elements[index].y : 0, "px"),
        left: "".concat(layout.elements[index] ? layout.elements[index].x : 0, "px"),
        transition: "".concat(ghostSourceId !== item.id && transition && layoutIsMount ? "top ".concat(transitionDuration, "ms ").concat(transitionTimingFunction, ", left ").concat(transitionDuration, "ms ").concat(transitionTimingFunction) : "none"),
        visibility: layout.elements[index] && layoutIsMount ? "visible" : "hidden",
        opacity: ghost && ghostSourceId === items[index].id ? 0 : 1
      },
      onLoad: loadHandler,
      onError: errorHandler,
      onClickCapture: onClickCapture
    }, items[index].element);

    return newComponent;
  });
  return _react["default"].createElement("div", {
    className: "masonry",
    ref: masonryLayout
  }, props.header && layoutIsMount && _react["default"].createElement("div", {
    style: {
      position: "relative",
      width: "".concat(layout.width, "px"),
      margin: "0 auto 0 auto"
    }
  }, props.header), _react["default"].createElement("div", {
    style: {
      position: "relative",
      width: "".concat(layout.width, "px"),
      height: "".concat(layout.height, "px"),
      margin: "0 auto 0 auto",
      // outline: "1px solid red",
      transition: transition && layoutIsMount ? "width ".concat(transitionDuration, "ms ").concat(transitionTimingFunction) : "none"
    },
    className: "boundry-box"
  }, renderItems, ghost && _react["default"].createElement(_Ghost["default"], {
    x: ghostPos.x,
    y: ghostPos.y,
    drag: drag,
    onGhostEndTransition: onGhostEndTransition,
    ghostTransitionDuration: ghostTransitionDuration,
    ghostTransitionTimingFunction: ghostTransitionTimingFunction
  }, ghost), layout.endline.start.y !== undefined && _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
    id: "MasonryLayoutEndlineStart",
    ref: endlineStartRef,
    style: {
      position: "absolute",
      top: "".concat(layout.endline.start.y, "px"),
      left: "".concat(layout.endline.start.x, "px")
    }
  }), _react["default"].createElement("div", {
    id: "MasonryLayoutEndlineEnd",
    ref: endlineEndRef,
    style: {
      position: "absolute",
      top: "".concat(layout.endline.end.y, "px"),
      left: "".concat(layout.endline.end.x, "px")
    }
  }))));
}

DraggableMasonryLayout.propTypes = {
  reverse: _propTypes["default"].bool,
  onEndlineEnter: _propTypes["default"].func,
  onRearrange: _propTypes["default"].func,
  onWidthResize: _propTypes["default"].func,
  transitionDuration: _propTypes["default"].number,
  transitionTimingFunction: _propTypes["default"].string,
  ghostTransitionDuration: _propTypes["default"].number,
  ghostTransitionTimingFunction: _propTypes["default"].string
};
DraggableMasonryLayout.defaultProps = {
  transitionDuration: 600,
  transitionTimingFunction: "ease",
  ghostTransitionDuration: 200,
  ghostTransitionTimingFunction: "ease"
};
var _default = DraggableMasonryLayout;
exports["default"] = _default;
