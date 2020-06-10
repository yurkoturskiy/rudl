/*
 * This hook listen referenced element and update state on resize
 * For now it returns only width, but can be extended.
 */

import React, { useEffect, useCallback, useRef, useState } from "react";

function useResponsiveRef(
  action: (newWidth: number) => void
): [React.RefObject<HTMLDivElement>, number | undefined] {
  const [width, setWidth] = useState<number>();
  const ref = useRef<HTMLDivElement>(null);
  const onWidthResize = useCallback(action, [action]);
  const handleResize = useCallback(() => {
    const element = ref.current as HTMLDivElement;
    const newWidth = element.offsetWidth;
    setWidth(newWidth);
    width !== newWidth && onWidthResize(newWidth);
  }, [onWidthResize, width]);

  useEffect(() => {
    const element = ref.current as HTMLDivElement;
    setWidth(element.offsetWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return [ref, width];
}

export default useResponsiveRef;
