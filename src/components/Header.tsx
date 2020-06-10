import React from "react";

interface Props {
  width: number;
  component: JSX.Element;
}

const Header: React.FC<Props> = ({ width, component }) => {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        margin: "0 auto 0 auto",
      }}
    >
      {component}
    </div>
  );
};

export default Header;
