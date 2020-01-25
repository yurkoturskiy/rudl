import React from "react";
import PropTypes from "prop-types";

function ItemComponent({
  item,
  layoutElement,
  ghostSourceId,
  transition,
  layoutIsMount,
  transitionDuration,
  transitionTimingFunction,
  ghostIsActive,
  loadHandler,
  onClickCapture
}) {
  return (
    <div
      className="element-bounding"
      id={`${item.id}-wrapper`}
      key={`${item.id}-wrapper`}
      style={{
        position: "absolute",
        margin: 0,
        padding: 0,
        userSelect: "none",
        top: `${layoutElement ? layoutElement.y : 0}px`,
        left: `${layoutElement ? layoutElement.x : 0}px`,
        transition: `${
          ghostSourceId !== item.id && transition && layoutIsMount
            ? `top ${transitionDuration}ms ${transitionTimingFunction}, left ${transitionDuration}ms ${transitionTimingFunction}`
            : "none"
        }`,
        visibility: layoutElement && layoutIsMount ? "visible" : "hidden",
        opacity: ghostIsActive && ghostSourceId === item.id ? 0 : 1
      }}
      onLoad={loadHandler.onLoad}
      onError={loadHandler.onError}
      onClickCapture={onClickCapture}
    >
      {item.element}
    </div>
  );
}

ItemComponent.propTypes = {
  item: PropTypes.object,
  layoutElement: PropTypes.object,
  ghostSourceId: PropTypes.any,
  transition: PropTypes.bool,
  layoutIsMount: PropTypes.bool,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  ghostIsActive: PropTypes.bool,
  loadHandler: PropTypes.object,
  onClickCapture: PropTypes.func
};

export default ItemComponent;
