import React from "react"
import Fab from "@material/react-fab"
import MaterialIcon from "@material/react-material-icon"

interface Props {
  sandwichBtnRef: React.RefObject<HTMLDivElement>
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SandwichButton: React.FC<Props> = ({
  sandwichBtnRef,
  isVisible,
  setIsVisible,
}) => {
  return (
    <div ref={sandwichBtnRef}>
      <Fab
        className="sandwich-button"
        icon={<MaterialIcon icon={isVisible ? "close" : "menu"} />}
        onClick={() => setIsVisible(!isVisible)}
      />
    </div>
  )
}

export default SandwichButton
