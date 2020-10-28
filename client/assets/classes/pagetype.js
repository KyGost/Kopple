import {newElement} from './utilities.js'
import Actions from './actions.js'
import Post from '../elements/post.js'
import Constant from './constant.js'
import Store from './store.js'

const PageType = {
  feed: async () => {
    Actions.clearFeed()
    await Store.update(Actions.loadFeed)
    Actions.loadInteractions.load()
  },
  newInstall: () => {
    Actions.resetFiles()
    window.location.hash = ''
    alert('Welcome to Kopple!\nTell people your address is:\n' + location.hostname + '\n(You can copy it from the URL bar)\n\nYou should probably bookmark this page by the way!')
  },
  profile: async () => {
    let address = window.location.hash.replace('#PROFILE:', '')
    let feedElement = document.getElementById(Constant.id.feedID)

    Actions.clearFeed()
    await Store.update(Actions.loadFeed, 0, address)
    Actions.loadInteractions.load()
  },
  postLink: async () => {
    let [address, identity] = window.location.hash.replace('#POST:', '').split('-')
    let feedElement = document.getElementById(Constant.id.feedID)
    
    await Store.update(undefined, 0, address)
    Actions.clearFeed()

    let {self, feed} = Store.knowledgeBase[address]
    let post = feed.find(post => post.identity == identity)
    if(post) {
      let posterSelf = (self || [])[0] || Constant.userDefault;
      let name = posterSelf.name || Constant.userDefault.name,
        avatar = posterSelf.avatar || Constant.userDefault.avatar
      let poster = {
        address: address,
        name: name,
        avatar: avatar
      }
      post = {
        identity: identity,
        poster: poster,
        ...post
      }

      feedElement.appendChild(new Post(post).asHTML())
    } else feedElement.appendChild(newElement(
      'post', // not really but works with existing code this way
      'div',
      [
        newElement(
          'warning',
          'div',
          'POST NOT FOUND'
        )
      ]
    ))
  }
}

export default PageType