import React, { useState, useRef, useEffect, useCallback } from "react"
import SideBar from "./SideBar"
import SandwichButton from "./SandwichButton"

function Menu() {
  const [isVisible, setIsVisible] = useState(false)
  const sandwichBtnRef = useRef<HTMLDivElement>(null)
  const sideBarRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: Event) => {
    // Collapse on click outside of the menu
    if (
      sandwichBtnRef.current &&
      !sandwichBtnRef.current.contains(event.target as Node) &&
      sideBarRef.current &&
      !sideBarRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isVisible, handleClickOutside])
  return (
    <div style={{ zIndex: isVisible ? 8 : undefined }}>
      <SideBar sideBarRef={sideBarRef} isVisible={isVisible} />
      <SandwichButton
        sandwichBtnRef={sandwichBtnRef}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  )
}

export default Menu
