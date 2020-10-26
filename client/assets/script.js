import Post from './elements/post.js'
import Reply from './elements/reply.js'
import Dialog from './elements/dialog.js'

import Actions from './classes/actions.js'
import * as Utilities from './classes/utilities.js'
import Sort from './classes/sort.js'

import Constant from './classes/constant.js'
import State from './classes/state.js'

import Setting from './classes/setting.js'
import Theme from './classes/theme.js'

import Store from './classes/store.js'

import PageType from './classes/pagetype.js'

/// Debug/Other
const isDevelopmentDrive = window.location.hostname === 'bfa59937d1c74437f015096ab07ef04c30c051ad5a9d4bdf9d01abb19ca97f1c';

// Document Manipulation
document.addEventListener('mousemove', () => {
  if(!State.doRefresh) State.doRefresh = true
})
// TODO: Service workers. Dependancy: Service workers in Agregore/Beaker
// Manual interaction
const menuFollow
  = (
  ) => {
    let extraInfo = Utilities.newElement(
      'found',
      'p'
    )
    new Dialog({
      title: 'Follow User',
      notes: 'Enter an address below',
      doneText: 'Follow',
      type: 'singleInput',
      extraInfo: extraInfo,
      inputs: [
        {
          id: 'address',
          label: 'Address',
          type: 'text',
          placeholder: '833d719039176d2803dcb76576684864953e2550760209b76183054841471fda',
          events: {
            'keyup': (event) => {
              fetch('hyper://' + event.srcElement.value + '/store/self.json')
                .then(result => result.json()
                  .then(json => {
                    extraInfo.innerText = json[0].name;
                  })
                ).catch(error => {
                  extraInfo.innerText = 'User not found';
                })
            }
          }
        }
      ],
      doneClick: (element) => {
        Store.files.follows.push({
          address: document.querySelector('#address').value // Not sure I like this
        })
        Store.saveFiles()
      }
    })
  }
const menuSettings
  = (
  ) => {
    let extraInfo = Utilities.newElement(
      'found',
      'p'
    )
    new Dialog({
      title: 'Settings',
      notes: 'Set your settings',
      doneText: 'Save',
      extraInfo: extraInfo,
      inputs: [
        {
          id: 'profileDrive',
          label: 'Profile',
          type: 'text',
          value: Setting.profileDrive
        },
        {
          id: 'crawlDistance',
          label: 'Crawl Distance',
          type: 'number',
          value: Setting.crawlDistance
        },
        {
          id: 'theme',
          label: 'Theme',
          type: 'select',
          options: Object.keys(Theme),
          value: Setting.theme
        }
      ],
      doneClick: () => {
        Setting.profileDrive = document.querySelector('#profileDrive').value // Not sure I like this
        Setting.crawlDistance = document.querySelector('#crawlDistance').value // Not sure I like this
        Setting.theme = document.querySelector('#theme').value // Not sure I like this
      }
    })
  }

// Routine
const onStart
  = (
  ) => {
    if(!Setting.profileDrive) {
      new Dialog({
        title: 'Welcome!',
        notes: 'Do you already have a Kopple drive?',
        inputs: [
         {
           type: 'button',
           value: 'Yes',
           events: {
            click: () => {
              let extraInfo = Utilities.newElement(
                'found',
                'p'
              )
              new Dialog({
                title: 'What is your drive?',
                notes: 'Enter it below',
                extraInfo: extraInfo,
                inputs: [
                {
                  id: 'address',
                  label: 'Address',
                  type: 'text',
                  placeholder: '833d719039176d2803dcb76576684864953e2550760209b76183054841471fda',
                  events: {
                    'keyup': (event) => {
                      fetch('hyper://' + event.srcElement.value + '/store/self.json')
                        .then(result => result.json()
                          .then(json => {
                            extraInfo.innerText = json[0].name;
                          })
                        ).catch(error => {
                          extraInfo.innerText = 'User not found';
                        })
                      }
                    }
                  }
                ],
                doneClick: (element) => {
                  Setting.profileDrive = document.querySelector('#address').value // Not sure I like this
                }
              })
            }
           }
         },
         {
           type: 'button',
           value: 'No'
         }
        ]
      })
      return
    }

    Actions.loadTheme(Setting.theme)

    // Check if vistor owns drive
    beaker.hyperdrive.writeFile(`hyper://${Setting.profileDrive}/.writeCheck`, '').catch(() => {
      document.querySelector('#feedNewPost').innerHTML = Utilities.newElement(
        'warning',
        'div',
        'THIS IS NOT YOUR DRIVE'
      ).outerHTML
    })

    var afterUpdate
    if(window.location.hash !== '') {
      if(window.location.hash === '#NEWINSTALL') PageType.newInstall()
      else if(window.location.hash.startsWith('#PROFILE:')) afterUpdate = PageType.profile
      else if(window.location.hash.startsWith('#POST:')) afterUpdate = PageType.postLink
    } else afterUpdate = feedLoad // TODO: move to PageType
    
    Store.update().then(afterUpdate)
    // If name is not currently set, prompt
    Store.loadFiles().then(() => {
      if(Store.files.self[0].name === undefined) {
        let newName = prompt('Welcome! Set your name:');
        if(newName !== null && newName !== false) {
          Store.files.self[0].name = newName;
          Store.saveFiles();
        }
      }

      document.querySelector('#menuSelf img').src = Store.files.self[0].avatar || defaultAvatar;
    });
    window.setInterval(() => {
      if(State.doRefresh && State.refreshFeed) {
        State.doRefresh = false;
        Store.update().then(afterUpdate); // TODO: Change for profiles
      }
    }, Constant.refreshInterval);
  }

// Feed
/// Feed New
const feedNewPostPost
  = async (
  ) => {
    const contentElement = document.getElementById(Constant.id.feedNewPostID + 'Content');
    const tagsElement = document.getElementById(Constant.id.feedNewPostID + 'Tags');
    const filtersElement = document.getElementById(Constant.id.feedNewPostID + 'Filters');

    var post = {};
    post.identity = Store.files.self[0].nextPostIdentity;
    Store.files.self[0].nextPostIdentity = Store.files.self[0].nextPostIdentity + 1 | 0;
    post.content = contentElement.innerText;
    post.tags = Utilities.arrayFromCSV(tagsElement.value);
    post.filters = Utilities.arrayFromCSV(filtersElement.value);
    post.posted = new Date().getTime();

    contentElement.innerText = '';
    tagsElement.value = '';
    filtersElement.value = '';

    Store.files.feed.push(post);
    Store.saveFiles().then(() => {
      Store.update(1).then(() => feedLoad());
    });
  }

/// Feed Load
const feedLoad
  = async (
  ) => {
    var posts = [];
    var interactions = [];
    Object.keys(Store.knowledgeBase).forEach((address) => {
      let knowledge = Store.knowledgeBase[address];
      let self = (knowledge.self || [])[0] || Constant.userDefault;
      let name = self.name || Constant.userDefault.name,
        avatar = self.avatar || Constant.userDefault.avatar
      let poster = {
        address: address,
        name: name,
        avatar: avatar
      };
      
      if(knowledge.self) {
        knowledge.feed.forEach(post => {
          posts.push({
            ...Constant.dataDefault.post,
            poster: poster,
            ...post
          });
        });
        knowledge.interactions.forEach(interaction => {
          interactions.push({
            ...Constant.dataDefault.interaction,
            poster: poster,
            ...interaction
          });
        });
      }
    });
    posts.sort(Sort.PostByDate)
    interactions.sort(Sort.PostByDate)
    feedLoadPosts(posts)
    feedLoadInteractions(interactions)
  }
//// Feed Load Posts
const feedLoadPosts
  = (
    posts
  ) => {
    let feedElement = document.getElementById(Constant.id.feedID);

    Array.from(feedElement.getElementsByClassName('post')).forEach(element => {
      feedElement.removeChild(element);
    });
    
    let loadStart = performance.now()
    posts.forEach(post => {
      feedElement.appendChild(new Post(post).asHTML())
    });
    console.log('Post load took', performance.now() - loadStart, 'ms')
  }
//// Feed Load Interactions
const feedLoadInteractions
  = (
    interactions
  ) => {
    var reposts = [];
    var replies = [];
    var reacts = [];
    interactions.forEach((interaction) => {
      switch(interaction.type) {
        case 'repost':
          reposts.push(interaction);
          break;
        case 'reply':
        case 'comment': // AKA (historical) TODO: Phase out
          replies.push(interaction);
          break;
        case 'react':
          reacts.push(interaction);
          break;
        default:
          break;
      }
    });
    feedLoadReplies(replies);
  }
///// Feed Load replies
const feedLoadReplies
  = (
    replies
  ) => {
    replies.forEach(reply => {
      let postElementID = ['post', reply.address, reply.postIdentity].join('-');
      let postElement = document.getElementById(postElementID);
      if(!postElement) console.log('Post:',postElementID,'not found, interaction not loaded.')
      else {
        let repliesElement = postElement.querySelector('.replies')
        postElement.classList.add('hasReplies') // Good enough
        repliesElement.appendChild(new Reply(reply).asHTML()) 
      }
    });
  }
///// Feed Load (Reposts and Reactions) TODO

window.onhashchange = onStart
window.onStart = onStart
//window.menuProfile = menuProfile
window.menuFollow = menuFollow
window.menuSettings = menuSettings
window.feedNewPostPost = feedNewPostPost
window.store = Store

// Debug
if(isDevelopmentDrive) {
  window.feedLoad = feedLoad
}