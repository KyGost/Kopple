import Dialog from './elements/dialog.js'

import Actions from './classes/actions.js'
import * as Utilities from './classes/utilities.js'

import Constant from './classes/constant.js'
import State from './classes/state.js'

import Setting from './classes/setting.js'
import Theme from './classes/theme.js'

import Store from './classes/store.js'

import PageType from './classes/pagetype.js'

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
        Store.files.follows.push({ // TODO: Unfollow
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
    document.body.setAttribute('page', location.hash.replace(/#(.*):.*/g, '$1') || 'FEED')

    if(!Setting.profileDrive) return welcomeDialog()

    Actions.loadTheme(Setting.theme)

    // Check if vistor owns drive
    beaker.hyperdrive.writeFile(`hyper://${Setting.profileDrive}/.writeCheck`, '').catch(() => {
      document.querySelector('#feedNewPost').innerHTML = Utilities.newElement(
        'warning',
        'div',
        'THIS IS NOT YOUR DRIVE'
      ).outerHTML
    })

    Store.loadFiles().then(() => {
      PageType[State.page](true)
      // If name is not currently set, prompt
      if(Store.files.self[0].name === undefined) {
        new Dialog({
          title: 'Welcome!',
          notes: 'Set your name',
          inputs: [
            {
              id: 'name',
              label: 'Name',
              type: 'text',
              placeholder: 'John'
            }
          ],
          doneClick: () => {
            Store.files.self[0].name = document.querySelector('#name').value
            Store.saveFiles()
          }
        })
      }

      document.querySelector('#menuSelf').addEventListener('click', () => {location.hash = '#PROFILE:' + Setting.profileDrive})
      document.querySelector('#menuSelf img').src = Store.files.self[0].avatar
    })
  }

const welcomeDialog
  = (
  ) => new Dialog({
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
                doneClick: () => {
                  Setting.profileDrive = document.querySelector('#address').value // Not sure I like this
                }
              })
            }
           }
         },
         {
           type: 'button',
           value: 'No',
           events: {
            click: async () => {
              // Not possible to in Agregore atm (CORS: Link)
              const newDrive = await beaker.hyperdrive.createDrive({title: 'Kopple'})
              window.onhashchange = () => {}
              location.hash = '#NEWINSTALL'
              Setting.profileDrive = newDrive.url.replace(/.*\/\/(.*)\/.*/g, '$1')
            }
           }
         }
        ]
      })

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
      PageType[State.page]()
    })
  }

window.onStart = onStart
//window.menuProfile = menuProfile
window.menuFollow = menuFollow
window.menuSettings = menuSettings
window.feedNewPostPost = feedNewPostPost
window.store = Store
window.resetFiles = Actions.resetFiles

// Debug
window.loadPage = PageType[State.page]