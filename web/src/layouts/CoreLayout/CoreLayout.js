import PropTypes from 'prop-types'

import './CoreLayout.css'
import '../../styles/core.css'
// import '../../../node_modules/flexboxgrid/dist/flexboxgrid.css'

import Header from '../../components/Header'
import React from 'react'
import Footer from './../../components/Footer'

export const CoreLayout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
)

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired
}

export default CoreLayout
