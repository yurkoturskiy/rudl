/*
 * This hook listen referenced element and update state on resize
 * For now it returns only width, but can be extended.
 */

import React, { useEffect, useCallback, useRef, useState } from "react";

function useResponsiveRef(action) {
  const [width, setWidth] = useState(null);
  const ref = useRef(null);
  const onWidthResize = useCallback(action, [action]);
  const handleResize = useCallback(() => {
    const newWidth = ref.current.offsetWidth;
    width !== newWidth && onWidthResize(newWidth);
    setWidth(newWidth);
  }, [onWidthResize, width]);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return [ref, width];
}

export default useResponsiveRef;
