import Constant from './constant.js'

import {readFromFile, writeToFile, locationFromFile} from './utilities.js'

var crawled; // TODO: Perhaps this can be done better?
const crawl
  = (
    distance,
    address = location.host,
    origin = true
  ) => {
    return new Promise((resolve, reject) => {
      if(origin) crawled = [];
      crawled.push(address);

      console.log('Crawling ' + address + ' ' + distance + ' steps to go.');

      var waitFor = [];
      Store.knowledgeBase[address] = [];
      // TODO: Return as recieved
      Constant.acceptedFiles.forEach(file => {
        waitFor.push(new Promise((resolveInner, reject) => {
          try {
            beaker.hyperdrive.readFile('hyper://' + address + locationFromFile(file), {encoding: 'json', timeout: 1000})
              .then(result => {
                //beaker.hyperdrive.writeFile('/cache/' + address + '/' + file + '.json', result, 'json');
                Store.knowledgeBase[address][file] = result;

                if(file == 'follows' && distance > 0) {
                  var awaitCrawls = [];
                  result.forEach(follow => {
                    if(follow.address != undefined && !crawled.includes(follow.address)) awaitCrawls.push(crawl(distance - 1, follow.address, false));
                  });
                  Promise.all(awaitCrawls).then(() => {resolveInner()});
                } else resolveInner();
              })
              .catch(error => {
                console.log('Bad crawl, address:', address, 'Error:', error);
                resolveInner();
              });
          } catch(error) {
            console.log(error);
          }
        }));
      });
      Promise.all(waitFor).then(()=>{resolve()});
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
          Promise.all(awaitSave).then((
            ) => {
              resolve()
            }
          )
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
      crawlDistance = 3
    ) => {
      return crawl(crawlDistance).then((
        ) => {
          console.log('Knowledge Base Filled');
        }
      );
    }
}
export default Store