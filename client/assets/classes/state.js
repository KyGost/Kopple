var State = {
  get page() {
    return (window.location.hash === '')
      ? 'feed'
      : (window.location.hash === '#NEWINSTALL')
        ? 'newInstall'
        : (window.location.hash.startsWith('#PROFILE:'))
          ? 'profile'
          : (window.location.hash.startsWith('#POST:'))
            ? 'postLink'
            : 'error'
  }
}
export default State