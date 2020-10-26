import {newElement} from './utilities.js'
import Post from './post.js'
import Constant from './constant.js'
import Store from './store.js'

const PageType = {
  newInstall: () => {
    resetFiles()
    window.location.hash = ''
    alert('Welcome to Kopple!\nTell people your address is:\n' + location.hostname + '\n(You can copy it from the URL bar)\n\nYou should probably bookmark this page by the way!')
  },
  profile: () => {
    let profile = window.location.hash.replace('#PROFILE:', '')
    // TODO
  },
  postLink: () => {
    let [address, identity] = window.location.hash.replace('#POST:', '').split('-')
    let feedElement = document.getElementById(Constant.id.feedID);

    Array.from(feedElement.getElementsByClassName('post')).forEach(element => {
      feedElement.removeChild(element);
    })

    beaker.hyperdrive.readFile('hyper://' + address + '/store/feed.json', 'json')
      .then(feed => {
        let posterSelf = (Store.knowledgeBase[address].self || [])[0] || Constant.userDefault;
        let name = posterSelf.name || Constant.userDefault.name,
          avatar = posterSelf.avatar || Constant.userDefault.avatar
        let poster = {
          address: address,
          name: name,
          avatar: avatar
        }
        let post = {
          identity: identity,
          poster: poster,
          ...feed.find(post => post.identity == identity)
        }

        feedElement.appendChild(new Post(post).asHTML())
      })
      .catch((error) => {
        console.error(error)
        feedElement.appendChild(newElement(
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
      })
  }
}

export default PageType