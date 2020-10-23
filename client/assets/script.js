import Post from './classes/post.js'
import Reply from './classes/reply.js'

import Dialog from './classes/dialog.js'

import * as Utilities from './classes/utilities.js'

import Constant from './classes/constant.js'
import State from './classes/state.js'

import Setting from './classes/setting.js'
import Theme from './classes/theme.js'

import Store from './classes/store.js'

/// Update 'repository'
const updateDrive = 'hyper://b71a2b60a0e08ce5c9766c99f3b0c4b6c1861499d14c723ff8be57f47479a900';

/// Debug/Other
const isDevelopmentDrive = window.location.hostname === '833d719039176d2803dcb76576684864953e2550760209b76183054841471fda';

// Document Manipulation
document.addEventListener('mousemove', (
  ) => {
    if(!State.doRefresh) State.doRefresh = true
  }
)
/* window.addEventListener('load', () => {
  navigator.serviceWorker.register('assets/sw.js').then(register => {
    console.log('SW Registered');
	}).catch(error => {
    console.log('SW Registration failed: ' + error);
	});
}); */ // TODO: Service workers. Dependancy: Service workers in Agregore/Beaker

// Utilities
/// Basic Utilities


/// Functional Utilities


/// Sorting
const sortByDate
  = (
    a,
    b
  ) => {
    return a.posted < b.posted ? 1 : -1;
  }

const update
  = async (
  ) => {
    if((await beaker.hyperdrive.readFile('/client/manifest.json', 'json')).version != (await beaker.hyperdrive.readFile(updateDrive + '/client/manifest.json', 'json')).version) {
      const find = async (
          oldItems
        ) => {
          let items = await beaker.hyperdrive.query({
              drive: updateDrive,
              path: oldItems.map(item => item.path + (item.type == 'directory' ? '/*' : ''))
            })
          if(items.length > oldItems.length) find(items);
          else items.forEach(async item => {
            console.log('Updating ' + item.path);
            try {
              console.log('Downloading ' + item.path);
              let read = await beaker.hyperdrive.readFile(updateDrive + item.path)
              console.log('Installing ' + item.path);
              beaker.hyperdrive.writeFile(item.path, read);
            } catch (error) {
              console.log('File update error, file: ' + item.path + ' error: ' + error);
            }
          });
        }
      find([{type: 'directory', path: '/client'}])
    }
  }

// Debug/Console
const follow
  = async (
    address
  ) => {
    if(!Store.files.follows.some(follow => follow.address === address)) {
      Store.files.follows.push({address: address});
      Store.saveFiles();
    }
    else throw 'Already following address';
  }
const resetFiles
  = async (
  ) => {
    for(var i = 0; i < Constant.acceptedFiles.length; i++) {
      let file = Constant.acceptedFiles[i];
      let content = file == 'self' ? [{}] : [];
      await beaker.hyperdrive.writeFile(Utilities.locationFromFile(file), content, 'json');
    }
    location.reload();
  }

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
        singleInput: {
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
                  found.innerText = 'User not found';
                })
            }
          }
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
        doneText: 'Follow',
        extraInfo: extraInfo,
        multipleInput: [
          {
            label: 'Theme',
            type: 'dropdown',
            options: Object.keys(Theme)
          }
        ]
      })
  }

// Routine
const onStart
  = (
  ) => {
    var afterUpdate = () => feedLoad(); 
    if(window.location.hash === '#NEWINSTALL') {
      resetFiles();
      window.location.hash = '';
      alert('Welcome to Kopple!\nTell people your address is:\n' + location.hostname + '\n(You can copy it from the URL bar)\n\nYou should probably bookmark this page by the way!');
    } else if (window.location.hash.startsWith('#PROFILE:')) {
      let profile = window.location.hash.replace('#PROFILE:', '');
      afterUpdate = () => {};
      // TODO
    }

    if(!isDevelopmentDrive) update();
    Store.update().then(afterUpdate);
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
        Store.update().then(() => feedLoad()); // TODO: Change for profiles
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
            poster: poster,
            ...post
          });
        });
        knowledge.interactions.forEach(interaction => {
          interactions.push({
            poster: poster,
            ...interaction
          });
        });
      }
    });
    posts.sort(sortByDate);
    interactions.sort(sortByDate);
    feedLoadPosts(posts);
    feedLoadInteractions(interactions);
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

    posts.forEach(post => {
      feedElement.appendChild(new Post(post).asHTML())
    });
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
      try {
        let postElement = document.getElementById(postElementID);
        let repliesElement = postElement.querySelector('.replies');
        postElement.classList.add('hasReplies'); // Good enough
        repliesElement.appendChild(new Reply(reply).asHTML())
      } catch(error) {
        console.log('Post:',postElementID,'not found, interaction not loaded.');
      }
    });
  }
///// Feed Load (Reposts and Reactions) TODO

window.onStart = onStart
//window.menuProfile = menuProfile
window.menuFollow = menuFollow
window.menuSettings = menuSettings
window.feedNewPostPost = feedNewPostPost
window.store = Store
window.update = update