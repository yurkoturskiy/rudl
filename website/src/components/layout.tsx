/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { ThemeProvider } from "styled-components"
import theme from "./theme"

import "../styles/layout.css"
import "@material/react-fab/dist/fab.css"
import "@material/react-material-icon/dist/material-icon.css"
import Header from "./Header"

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <main>{children}</main>
    </ThemeProvider>
  )
}

export default Layout
