import React from "react"
import styled, { StyledComponent } from "styled-components"
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
  href: string
}

type ExternalLinkProps = TypographyProps & ColorProps & SpaceProps & Props

const ExternalLink = styled.a<any>`
  text-decoration: ${(props: Props) => props.textDecoration};
  ${color}
  ${typography}
  ${space}
`

export default ExternalLink
