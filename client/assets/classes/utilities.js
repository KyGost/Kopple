import Constant from './constant.js'

// Constants
/// Formatters/Converters
//// Markdown // While true that commonmark is faster than showdown, the file size is more bloated, especially so since the minified file doesn't seem to load. The file also doesn't have HTML to Markdown functionality. Something that is useful.
const markdownParser = new commonmark.Parser();
const markdownRenderer = new commonmark.HtmlRenderer({safe: true});
/// Intl
const rtf = new Intl.RelativeTimeFormat();
const dtf = new Intl.DateTimeFormat();
/// Other
const dateUnits = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365/12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

// Functions
const newElement
  = (
    elementClass,
    tag,
    contents = [],
    attributes = {},
    special = () => {}
  ) => {
    let element = document.createElement(tag);
    element.classList.add(elementClass);
    if(Array.isArray(contents)) contents.forEach(content => {
      element.appendChild(content);
    });
    else element.innerHTML = contents;
    for(let attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute])
    };
    special(element);
    return element;
  }

const appropriateUnit
  = (
    difference
  ) => {
    for(let unit in dateUnits) if(unit === 'second' || Math.abs(difference) > dateUnits[unit]) return unit;
  }
const formatDateDifference
  = (
    date
  ) => {
    let difference = date - new Date();
    let unit = appropriateUnit(difference);
    return rtf.format(Math.round(difference / dateUnits[unit]), unit)
  }
const formatDateTime
  = (
    date
  ) => {
    return dtf.format(date)
  }

const markdownToHTML
  = (
    markdown
  ) => {
    return markdownRenderer.render(markdownParser.parse(markdown))
  }

const selfAsFollow // Just do inline?
  = (
  ) => {
    return {
      address: location.host,
    }
  }

const preventHTMLInContentEditable
  = (
    event
  ) => {
    if(event.key === 'Enter') {
      document.execCommand('insertLineBreak');
      event.preventDefault();
    }
  }

// Random Junk
const arrayFromCSV
  = (
    CSV
  ) => {
    return CSV.split(',').filter(element => element !== '')
  }


// File IO
const readFromFile
  = (
    file
  ) => {
    return beaker.hyperdrive.readFile(locationFromFile(file), 'json');
  }
const writeToFile
  = (
    file,
    object
  ) => {
    return beaker.hyperdrive.writeFile(locationFromFile(file), object, 'json');
  }
const locationFromFile
  = (
    file
  ) => {
    if (!Constant.acceptedFiles.includes(file)) throw 'Not an accepted file!'
    else return '/store/' + file + '.json'
  }

export {
  newElement, formatDateDifference, formatDateTime, markdownToHTML, selfAsFollow, preventHTMLInContentEditable,
  arrayFromCSV,
  readFromFile, writeToFile, locationFromFile
}