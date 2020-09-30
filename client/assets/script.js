// Constants
const feedID = 'feed';
const feedNewPostID = feedID + 'NewPost';
const acceptedFiles = [
  'follows',
  'ignores',
  'feed',
  'interactions',
  'self',
  'filters',
];
const unnamedUserName = 'Unknown';

// blah
let store = {
  files: [],
  set files(file) {
    console.log(file);
  },
  knowledgeBase: [],
  update: function() {
    return crawl(3).then(() => {
      console.log('knowledge base filled');
    });
  }
}

// Utilities

const arrayFromCSV = CSV => {return CSV.split(',').filter(element => element !== '')};
const locationFromFile = file => {
  if (!acceptedFiles.includes(file)) throw 'Not an accepted file!';
  else {
    return '/store/' + file + '.json'
  }
}
const selfAsFollow = () => {
  return {
    address: location.host,
  };
}

async function resetFiles() {
  acceptedFiles.forEach(element => {
    beaker.hyperdrive.writeFile(locationFromFile(element),[],'json');
  });
}

async function readFromFile(file) {
  let fileLocation = locationFromFile(file);
  var read = await beaker.hyperdrive.readFile(fileLocation, 'json');
  return read;
}

async function appendToFile(file, object) {
  let fileLocation = locationFromFile(file);
  var read = await beaker.hyperdrive.readFile(fileLocation, 'json');
  read.push(object);
  beaker.hyperdrive.writeFile(fileLocation, read, 'json');
}

var crawled;
function crawl(distance, address = location.host, origin = true) {
  return new Promise((resolve, reject) => {
    if(origin) crawled = [];
    crawled.push(address);

    console.log('Crawling ' + address + ' ' + distance + ' steps to go.');

    var waitFor = [];
    store.knowledgeBase[address] = [];
    // TODO: Return as recieved
    acceptedFiles.forEach(file => {
      waitFor.push(new Promise((resolveInner, reject) => {
        beaker.hyperdrive.readFile('hyper://' + address + locationFromFile(file), 'json').then(result => {
          //beaker.hyperdrive.writeFile('/cache/' + address + '/' + file + '.json', result, 'json');
          store.knowledgeBase[address][file] = result;

          if(file == 'follows' && distance > 0) {
            var awaitCrawls = [];
            result.forEach(follow => {
              if(follow.address != undefined && !crawled.includes(follow.address)) awaitCrawls.push(crawl(distance - 1, follow.address, false));
            });
            Promise.all(awaitCrawls).then(() => {resolveInner()});
          } else resolveInner();
        });
      }));
    });
    Promise.all(waitFor).then(()=>{resolve()});
  });
}

// Functionality
function onStart() {
  store.update().then(() => feedLoad());
}

async function feedNewPostPost() {
  const contentElement = document.getElementById(feedNewPostID + 'Content');
  const tagsElement = document.getElementById(feedNewPostID + 'Tags');
  const filtersElement = document.getElementById(feedNewPostID + 'Filters');

  var post = {};
  post.identity = 0;
  post.content = contentElement.value;
  post.tags = arrayFromCSV(tagsElement.value);
  post.filters = arrayFromCSV(filtersElement.value);
  post.posted = new Date().getTime();

  contentElement.value = '';
  tagsElement.value = '';
  filtersElement.value = '';

  console.log(post);
  appendToFile('feed', post);
  feedLoad();
}

async function feedLoad() {
  var posts = [];
  Object.keys(store.knowledgeBase).forEach((address) => {
    let knowledge = store.knowledgeBase[address];
    let name;
    try {
      name = knowledge.self[0].name;
    } catch (error) {
      name = unnamedUserName;
    }
    knowledge.feed.forEach(post => {
      posts.push({
        posterAddress: address,
        posterName: name,
        ...post
      });
    });
  });
  feedLoadElements(posts);
}
async function feedLoadElements(feeds) {
  console.log(feeds);
  var posts = feeds;
  posts.sort((a, b) => {
    return a.posted < b.posted ? 1 : -1;
  });
  /*var posts = [];
  feeds.forEach(feed => {

  });*/
  let feedElement = document.getElementById(feedID);

  Array.from(feedElement.getElementsByClassName('post')).forEach(element => {
    feedElement.removeChild(element);
  });

  posts.forEach(element => {
    var post = document.createElement('div');
      post.classList.add('post');
      var poster = document.createElement('div');
        poster.classList.add('poster');
        poster.innerHTML = element.posterName;
      post.appendChild(poster);
      var content = document.createElement('div');
        content.innerHTML = beaker.markdown.toHTML(element.content);
      post.appendChild(content);
    feedElement.appendChild(post);
  });
}

async function follow(address) {
  if(!(await readFromFile('follows')).some(element => element.address == address)) appendToFile('follows', {address: address});
  else throw 'Already following address';
}