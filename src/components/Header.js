import React from "react";
import PropTypes from "prop-types";

function Header({ width, children }) {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        margin: "0 auto 0 auto"
      }}
    >
      {children}
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
};

export default Header;
