import React from "react"
import Text from "../components/DesignSystem/Text"
import Box from "../components/DesignSystem/Box"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/DesignSystem/Button"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Box m="0px auto 20px" maxWidth={600} style={{ outline: "1px solid red" }}>
      <Text as="h1" color="red" textAlign="center">
        Seamless Draggable Layout
      </Text>
      <Text as="p" textAlign="center">
        The best way to organize content
      </Text>
      <Button>Get Started</Button>
      <Button>Watch Video</Button>
    </Box>
  </Layout>
)

export default IndexPage
