import React from "react";

interface Props {
  pos: { x: string; y: string };
  isTransit: boolean;
  transDur: number;
  transTFunc: string;
  kernel: JSX.Element;
  onTransitionEnd(e: React.TransitionEvent): void;
}

const Ghost: React.FC<Props> = ({
  pos,
  isTransit,
  kernel,
  transDur,
  transTFunc,
  onTransitionEnd,
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
        transition,
      }}
      onTransitionEnd={onTransitionEnd}
    >
      {kernel}
    </div>
  );
};

export default Ghost;
