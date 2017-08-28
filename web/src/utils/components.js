import React from 'react'
import Auth from './../modules/Auth'
import { Link } from 'react-router'
import { map } from 'lodash'

const linksNotShowAuth = [
  '/login',
  '/signup',
  '/forgot',
  '/counter'
]
const labelLinksNotShowAuth = [
  'login',
  'cadastre-se',
  'forgot',
  'counter'
]
const linksShowAuth = [
  '/counter',
  '/dashboard',
  '/logout'
]
const labelNotShowAuth = [
  'counter',
  'dashboard',
  'logout'
]

/**
 * Cria os links do lado direito do Navbar
 * @returns elementoHtml
 */
export const links = () => {
  if (Auth.isUserAuthenticated()) {
    return map(linksShowAuth, (value, index) => {
      return (
        <li key={index}>
          <Link to={value}>
            {labelNotShowAuth[index]}
          </Link>
        </li>)
    })
  } else {
    return map(linksNotShowAuth, (value, index) => {
      return (
        <li key={index}>
          <Link to={value}>
            {labelLinksNotShowAuth[index]}
          </Link>
        </li>)
    })
  }
}


/**
 * Cria os links do lado direito do Navbar
 * @returns elementoHtml
 */
export const linksLabel = () => {
  if (Auth.isUserAuthenticated()) {
    return map(linksShowAuth, (value, index) => {
      return (
        // <li key={index}>
          <Link to={value}>
            {labelNotShowAuth[index]}
          </Link>
        // </li>
      )
    })
  } else {
    return map(linksNotShowAuth, (value, index) => {
      return (
        // <li key={index}>
          <Link to={value}>
            {labelLinksNotShowAuth[index]}
          </Link>
        // </li>
      )
    })
  }
}