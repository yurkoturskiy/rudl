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

const Flex = styled.div<Props>`
  display: flex;
  ${color}
  ${space}
  ${layout}
`

export default Flex
