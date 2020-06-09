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

const Button = styled.button<Props>`
  ${color}
  ${space}
  ${layout}
`

export default Button
