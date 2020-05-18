import React from "react";
import PropTypes from "prop-types";

const BoundryBox = ({
  width,
  height,
  transition,
  layoutIsMount,
  transitionDuration,
  transitionTimingFunction,
  children
}) => (
  <div
    style={{
      position: "relative",
      width: `${width}px`,
      height: `${height}px`,
      margin: "0 auto 0 auto",
      // outline: "1px solid red",
      transition:
        transition && layoutIsMount
          ? `width ${transitionDuration}ms ${transitionTimingFunction}`
          : "none"
    }}
    className="boundry-box"
  >
    {children}
  </div>
);

BoundryBox.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  transition: PropTypes.bool,
  layoutIsMount: PropTypes.bool,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  children: PropTypes.element
};

export default BoundryBox;
