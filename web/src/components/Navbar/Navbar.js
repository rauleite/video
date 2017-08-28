import React from 'react'
import { IndexLink } from 'react-router'
import LoginNav from './../../routes/Home/LoginNav/LoginNav'
import './Navbar.css'
import '../../styles/core.css'

import Menu from '../Menu'
import { isUrl } from '../../utils/url'
import { linksLabel } from './../../utils/components'


const Navbar = () => (
  <nav className='navbar'>
    <div className='container-fluid'>
      <div className='row'>

        <div className='col-xs-2'>
          <div className='box'>
            <IndexLink to='/'>
              M.m
            </IndexLink>
          </div>

        </div>

        <div className='col-xs-6 col-xs-10 col-md-10 col-lg-10'>
          <div className='box hidden-xs'>
            <ul className='nav nav-right'>
              {showLoginNav()}
            </ul>
          </div>
          <div className='box show-xs nav-right'>
            <ul className='nav nav-right'>
              <Menu links={linksLabel()} />
            </ul>
          </div>
        </div>

      </div>
    </div>
  </nav>
)

function showLoginNav() {
  if (isUrl('/')) {
    return <LoginNav />
  }
}

export default Navbar
