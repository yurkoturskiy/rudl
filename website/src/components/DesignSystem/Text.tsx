import styled from "styled-components"
import { color, typography, TypographyProps, ColorProps } from "styled-system"

type TextProps = TypographyProps & ColorProps

const Text = styled.div<TextProps>`
  ${color}
  ${typography}
`

export default Text
