import { browserHistory } from 'react-router'

/**
 * Redireciona para a url anterior
 */
export function redirectToPrevUrl () {
  // change the current URL
  let redirectPrevUrl = localStorage.getItem('urlPrevLogin')
  if (redirectPrevUrl) {
    browserHistory.push(redirectPrevUrl)
  } else {
    browserHistory.push('/')
  }
}

/**
 * Redireciona para a url informada
 * @param {string} pathname
 */
export function redirectToUrl (pathname) {
  browserHistory.push(pathname)
}

/**
 * Retorna se é ou não o path informado
 * @param {string} pathname
 * @return {boolean}
 */
export function isUrl (pathname) {
  return window.location.pathname === pathname
}
