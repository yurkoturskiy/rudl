import styled from "styled-components"
import {
  color,
  ColorProps,
  space,
  SpaceProps,
  layout,
  LayoutProps,
} from "styled-system"

type Props = ColorProps & SpaceProps & LayoutProps

const Box = styled.div<Props>`
  ${color}
  ${space}
  ${layout}
`

export default Box
