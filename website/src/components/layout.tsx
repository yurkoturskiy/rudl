/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "../styles/layout.css"
import "../styles/docs.css"
import "@material/react-fab/dist/fab.css"
import "@material/react-material-icon/dist/material-icon.css"

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  )
}

export default Layout
