import { Link as GLink } from "gatsby"
import styled from "styled-components"
import {
  color,
  typography,
  TypographyProps,
  ColorProps,
  space,
  SpaceProps,
} from "styled-system"

interface Props {
  textDecoration: string
}

type TextProps = TypographyProps & ColorProps & Props

const Text = styled<any>(GLink)`
  text-decoration: ${(props: Props) => props.textDecoration};
  ${color}
  ${typography}
  ${space}
`

export default Text
