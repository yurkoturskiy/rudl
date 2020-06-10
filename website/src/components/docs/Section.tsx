import React from "react"

interface SectionWrapperProps {
  item: any
  name: string
}

const Section: React.FC<SectionWrapperProps> = ({ item, name, children }) => {
  return (
    <div className="section">
      {item && <h2 className="item">{item}</h2>}
      {children}
    </div>
  )
}

export default Section
