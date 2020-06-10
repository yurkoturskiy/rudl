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

const Fixed = styled.div<Props>`
  position: fixed;
  ${color}
  ${space}
  ${layout}
  ${position}
`

export default Fixed
