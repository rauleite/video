export const deepFreeze = (obj) => {
  if (window.__DEV__) {
    require('deep-freeze')(obj)
  }
}

export const ImmutablePropTypes = (
  window.__DEV__ ?
  require('react-immutable-proptypes') :
  null
)

