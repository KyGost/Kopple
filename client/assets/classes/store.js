import Constant from './constant.js'
import Setting from './setting.js'

import Actions from './actions.js'

import fetch from '../bundles/api-beaker-polyfill-datfetch.js'

import {readFromFile, writeToFile, locationFromFile, timeoutSignal} from './utilities.js'

var crawled; // TODO: Perhaps this can be done better?
const crawl
  = (
    onComplete,
    distance,
    address = Setting.profileDrive,
    origin = true,
    crawlFiles = Constant.acceptedFiles,
    crawlNextFiles
  ) => {
    return new Promise((resolve, reject) => {
      if(crawlNextFiles === undefined) crawlNextFiles = crawlFiles
      if(origin) crawled = []
      crawled.push(address)

      console.log('Crawling', address, distance, 'steps to go.')

      var waitFor = [];
      Store.knowledgeBase[address] = []
      crawlFiles.forEach(file => {
        waitFor.push(new Promise((resolveInner, reject) => {
          try {
            let startTime = performance.now()
            fetch('hyper://' + address + locationFromFile(file), {signal: timeoutSignal()})
              .then(response => response.json())
              .then(result => {
                Store.knowledgeBase[address][file] = result

                if(file === 'follows' && distance > 0) {
                  var awaitCrawls = []
                  result.forEach(follow => {
                    if(follow.address != undefined && !crawled.includes(follow.address)) awaitCrawls.push(crawl(onComplete, distance - 1, follow.address, false, crawlNextFiles))
                  })
                  Promise.all(awaitCrawls).then(() => {resolveInner()})
                } else resolveInner()
              })
              .catch(error => {
                console.log('Bad crawl, address:', address, 'Error:', error, 'Attempted for:', performance.now() - startTime, 'ms')
                resolveInner()
              });
          } catch(error) {
            console.log(error)
          }
        }))
      })
      Promise.all(waitFor).then(() => {
        Store.knowledgeBase[address].self = Store.knowledgeBase[address].self?.map(self => {return {
          ...Constant.dataDefault.self,
          ...self,
          name: Store.files.follows.find(follow => follow.address === address)?.nickname ?? self.name
        }})
        const poster = {
          address: address,
          name: Store.knowledgeBase[address]?.self?.[0].name,
          avatar: Store.knowledgeBase[address]?.self?.[0].avatar
        }
        Store.knowledgeBase[address].feed = Store.knowledgeBase[address].feed?.map(post => {return {
          poster: poster,
          ...Constant.dataDefault.post,
          ...post
        }})
        Store.knowledgeBase[address].interactions = Store.knowledgeBase[address].interactions?.map(interaction => {return {
          poster: poster,
          ...Constant.dataDefault.interaction,
          ...interaction
        }})
        onComplete(address)
        resolve()
      })
    });
  }

let Store = {
  files: {}, // TODO: Find a way to automatically save whenever an object under files is changed.
  knowledgeBase: {},
  saveFiles
    : (
    ) => {
      return new Promise((
          resolve,
          reject
        ) => {
          let awaitSave = [];
          Constant.acceptedFiles.forEach((
              file
            ) => {
              awaitSave.push(writeToFile(file, store.files[file]));
            }
          );
          Promise.all(awaitSave).then(resolve)
        }
      );
    },
  loadFiles
    : (
    ) => {
      return new Promise((
          resolve,
          reject
        ) => {
          let loadingFiles = [];
          Constant.acceptedFiles.forEach((
              file
            ) => {
              loadingFiles.push(
                readFromFile(file)
                  .then(result => {store.files[file] = result})
                  .catch(console.error)
              )
            }
          )
          Promise.all(loadingFiles)
            .then(resolve)
            .catch(resolve)
        }
      )
    },
  update
    : (
      onComplete = () => {},
      crawlDistance = Setting.crawlDistance,
      address,
      origin,
      crawlFiles,
      crawlNextFiles
    ) => {
      return crawl(onComplete, crawlDistance, address, origin, crawlFiles, crawlNextFiles).then(() => {console.log('Knowledge Base Filled')})
    }
}
export default Store