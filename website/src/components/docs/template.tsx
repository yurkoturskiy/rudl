import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer"
import Layout from "../layout"
import SEO from "../seo"
import Menu from "./Menu"
import "./styles.css"
import Flex from "../DesignSystem/Flex"
import Box from "../DesignSystem/Box"

interface Props {
  data: {
    mdx: {
      frontmatter: {
        title: string
      }
      body: string
    }
  }
  path: string
}

const PageTemplate: React.FC<Props> = props => {
  const { title } = props.data.mdx.frontmatter
  return (
    <Layout>
      <SEO title={title} />
      <Flex
        width={["auto", "auto", "auto", 960, 960]}
        mx={["12px", "24px", "24px", "auto"]}
      >
        <Menu />
        <Box width={[1, 1, 1, 768]}>
          <MDXProvider>
            <MDXRenderer>{props.data.mdx.body}</MDXRenderer>
          </MDXProvider>
        </Box>
      </Flex>
    </Layout>
  )
}

export const query = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
      }
      body
    }
  }
`

export default PageTemplate
