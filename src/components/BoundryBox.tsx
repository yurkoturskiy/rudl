import React from "react";

interface Props {
  width: number;
  height: number;
  transition: boolean;
  layoutIsMount: boolean;
  transitionDuration: number;
  transitionTimingFunction: string;
}

const BoundryBox: React.FC<Props> = ({
  width,
  height,
  transition,
  layoutIsMount,
  transitionDuration,
  transitionTimingFunction,
  children,
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
          : "none",
    }}
    className="boundry-box"
  >
    {children}
  </div>
);

export default BoundryBox;
