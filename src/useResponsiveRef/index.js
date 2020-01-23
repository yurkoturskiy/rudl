/*
 * This hook listen referenced element and update state on resize
 * For now it returns only width, but can be extended.
 */

import React, { useEffect, useCallback, useRef, useState } from "react";

function useResponsiveRef() {
  const [width, setWidth] = useState(null);
  const ref = useRef(null);
  const handleResize = useCallback(() => setWidth(ref.current.offsetWidth), [
    ref
  ]);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return [ref, width];
}

export default useResponsiveRef;
