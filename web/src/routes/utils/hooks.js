import Auth from '../../modules/Auth'

/**
 * Previne acessos desnecessarios ao estar Autenticado
 * (Programacao Defensiva)
 * @param {object} prevState
 * @param {object} nextState
 * @param {function} replace
 */
export function previneAcessosAuth ({ location }, replace) {
  const pathSolicitado = location.pathname

  const pathsProibidos = ['/signup', '/login', '/forgot', '/reset']
  const isPathProibido = pathsProibidos.includes(pathSolicitado)
  if (pathSolicitado === '/' || !isPathProibido || !Auth.isUserAuthenticated()) {
    return
  }

  replace('/')
  return
}

/**
 * Proibe determinados acessos sem autenticacao
 * @param {object} nextState
 * @param {function} replace
 */
export function proibeAcessosSemAuth ({ location }, replace) {
  const pathSolicitado = location.pathname

  const pathsProibidos = ['/dashboard']
  const isPathProibido = pathsProibidos.includes(pathSolicitado)

  if (pathSolicitado === '/' || !isPathProibido) {
    return
  }

  if (Auth.isUserAuthenticated()) {
    return
  } else {
    replace('/')
  }
}

/**
 * Persiste a ultima url quando entra na tela de login, para redirecionamento posterior
 * @param {object} prevState
 * @param {object} nextState
 * @param {function} replace
 * @param {function} callback
 */
export function persistPrevLoginUrl (prevState, nextState, replace) {
  const nextLocation = nextState.location
  const prevLocation = prevState.location

  const pathsAPersistir = ['/login', '/logout']

  if (!pathsAPersistir.includes(nextLocation.pathname)) {
    return
  }

  localStorage.setItem('urlPrevLogin', prevLocation.pathname + prevLocation.search)
}
