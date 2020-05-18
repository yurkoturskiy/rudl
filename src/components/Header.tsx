import React from "react";
import PropTypes from "prop-types";

function Header({ width, component }) {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        margin: "0 auto 0 auto"
      }}
    >
      {component}
    </div>
  );
}

Header.propTypes = {
  component: PropTypes.element,
  width: PropTypes.number
};

export default Header;
