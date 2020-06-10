import styled from "styled-components"
import {
  color,
  ColorProps,
  space,
  SpaceProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
} from "styled-system"

type Props = ColorProps & SpaceProps & LayoutProps & PositionProps

const Box = styled.div<Props>`
  ${color}
  ${space}
  ${layout}
  ${position}
`

export default Box
