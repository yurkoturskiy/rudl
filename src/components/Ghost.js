import React from "react";
import PropTypes from "prop-types";

const Ghost = ({
  x,
  y,
  drag,
  ghostTransitionDuration,
  ghostTransitionTimingFunction,
  onGhostEndTransition,
  children
}) => (
  <>
    {children && (
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
        {children}
      </div>
    )}
  </>
);

Ghost.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  drag: PropTypes.bool,
  ghostTransitionDuration: PropTypes.number,
  ghostTransitionTimingFunction: PropTypes.string,
  onGhostEndTransition: PropTypes.func,
  children: PropTypes.element
};

export default Ghost;
