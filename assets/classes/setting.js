import Theme from './theme.js'
let Setting = {
  get profileDrive() {
    return localStorage.getItem('profileDrive')
  },
  set profileDrive(value) {
    localStorage.setItem('profileDrive', value)
    location.reload()
  },
  get crawlDistance() {
    return localStorage.getItem('crawlDistance') || 3
  },
  set crawlDistance(value) {
    localStorage.setItem('crawlDistance', value)
  },
  get theme() {
    return localStorage.getItem('theme') || 'DEFAULT'
  },
  set theme(value) {
    localStorage.setItem('theme', value)
  }
  // TODO: Find a way to make this less gross
}
export default Setting