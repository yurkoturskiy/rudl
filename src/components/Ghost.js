import React from "react";
import PropTypes from "prop-types";

const Ghost = ({
  x,
  y,
  drag,
  component,
  ghostTransitionDuration,
  ghostTransitionTimingFunction,
  onGhostEndTransition
}) => (
  <div
    style={{
      position: "fixed",
      visibility: "visible",
      left: x,
      top: y,
      pointerEvents: "none",
      transition: drag
        ? "none"
        : `left ${ghostTransitionDuration}ms ${ghostTransitionTimingFunction}, top ${ghostTransitionDuration}ms ${ghostTransitionTimingFunction}`
    }}
    onTransitionEnd={() => onGhostEndTransition()}
  >
    {component}
  </div>
);

Ghost.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  drag: PropTypes.bool,
  ghostTransitionDuration: PropTypes.number,
  ghostTransitionTimingFunction: PropTypes.string,
  onGhostEndTransition: PropTypes.func,
  component: PropTypes.element
};

export default Ghost;
