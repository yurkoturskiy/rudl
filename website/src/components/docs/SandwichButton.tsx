import React from "react"
import Fab from "@material/react-fab"
import MaterialIcon from "@material/react-material-icon"
import Fixed from "../DesignSystem/Fixed"

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
      <Fixed
        as={Fab}
        display={["inherit", "inherit", "inherit", "none"]}
        right="32px"
        bottom="32px"
        icon={<MaterialIcon icon={isVisible ? "close" : "menu"} />}
        onClick={() => setIsVisible(!isVisible)}
      />
    </div>
  )
}

export default SandwichButton
