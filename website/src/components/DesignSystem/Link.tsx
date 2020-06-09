import { Link as GLink, GatsbyLinkProps } from "gatsby"
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

type LinkProps = TypographyProps & ColorProps & SpaceProps & Props

const Link = styled<any>(GLink)`
  text-decoration: ${(props: Props) => props.textDecoration};
  ${color}
  ${typography}
  ${space}
`

export default Link
