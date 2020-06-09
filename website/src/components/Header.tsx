import React from "react"
import Link from "./DesignSystem/Link"
import ExternalLink from "./DesignSystem/ExternalLink"
import Flex from "./DesignSystem/Flex"

const Header = () => (
  <Flex>
    <Link to="/" m="12px auto 12px 12px" textDecoration="none">
      RUDL
    </Link>
    <Link m={12} to="/docs">
      Docs
    </Link>
    <ExternalLink m={12} href="https://github.com/guandjoy/rudl">
      GitHub
    </ExternalLink>
    <ExternalLink m={12} href="https://twitter.com/guandjoy">
      Twitter
    </ExternalLink>
  </Flex>
)

export default Header
