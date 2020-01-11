import React from "react";
import PropTypes from "prop-types";

function Endline({ startRef, endRef, startX, startY, endX, endY }) {
  return (
    <>
      <div
        id="MasonryLayoutEndlineStart"
        ref={startRef}
        style={{
          position: "absolute",
          top: `${startY}px`,
          left: `${startX}px`
        }}
      />
      <div
        id="MasonryLayoutEndlineEnd"
        ref={endRef}
        style={{
          position: "absolute",
          top: `${endY}px`,
          left: `${endX}px`
        }}
      />
    </>
  );
}

Endline.propTypes = {
  startRef: PropTypes.object,
  endRef: PropTypes.object,
  startX: PropTypes.number,
  startY: PropTypes.number,
  endX: PropTypes.number,
  endY: PropTypes.number
};

export default Endline;
