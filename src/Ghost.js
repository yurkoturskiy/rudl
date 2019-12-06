import React from "react";

function Ghost(props) {
  const { ghostTransitionDuration, ghostTransitionTimingFunction } = props;
  return (
    <div
      style={{
        position: "fixed",
        visibility: "visible",
        left: props.x,
        top: props.y,
        pointerEvents: "none",
        transition: props.drag
          ? "none"
          : `left ${ghostTransitionDuration}ms ${ghostTransitionTimingFunction}, top ${ghostTransitionDuration}ms ${ghostTransitionTimingFunction}`
      }}
      onTransitionEnd={() => props.onGhostEndTransition()}
    >
      {props.children}
    </div>
  );
}

export default Ghost;
