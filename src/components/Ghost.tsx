import React from "react";
import PropTypes from "prop-types";

const Ghost = ({
  pos,
  isTransit,
  kernel,
  transDur,
  transTFunc,
  onTransitionEnd
}) => {
  const transition = isTransit
    ? `left ${transDur}ms ${transTFunc}, top ${transDur}ms ${transTFunc}`
    : "none";
  return (
    <div
      style={{
        position: "fixed",
        visibility: "visible",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        transition
      }}
      onTransitionEnd={onTransitionEnd}
    >
      {kernel}
    </div>
  );
};

Ghost.propTypes = {
  pos: PropTypes.object,
  y: PropTypes.number,
  isTransit: PropTypes.bool,
  transDur: PropTypes.number,
  transTFunc: PropTypes.string,
  onTransitionEnd: PropTypes.func,
  kernel: PropTypes.element
};

export default Ghost;
