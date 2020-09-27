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
]

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

async function crawl(distance) {
  follows = await readFromFile('follows');
  follows.push(selfAsFollow());
  follows.forEach(follow => {
    acceptedFiles.forEach(file => {
      beaker.hyperdrive.readFile('hyper://' + follow.address + locationFromFile(file), 'json').then(result => {
        beaker.hyperdrive.writeFile('/cache/' + follow.address + '/' + file + '.json', result, 'json');
      });
    });
  });
}

// Functionality
function feedNewPostPost() {
  const contentElement = document.getElementById(feedNewPostID + 'Content');
  const tagsElement = document.getElementById(feedNewPostID + 'Tags');
  const filtersElement = document.getElementById(feedNewPostID + 'Filters');

  var post = {};
  post.identity = 0;
  post.content = contentElement.value;
  post.tags = arrayFromCSV(tagsElement.value);
  post.filters = arrayFromCSV(filtersElement.value);
  post.posted = new Date().getTime();

  console.log(post);
  appendToFile('feed', post);
}

function feedLoad() {
  let feedElement = document.getElementById(feedID);

  Array.from(feedElement.getElementsByClassName('feedItem')).forEach(element => {
    element.feedElement.removeChild(element);
  });

  crawl(3);
}