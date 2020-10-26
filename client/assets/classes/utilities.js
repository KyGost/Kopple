import Constant from './constant.js'
import Setting from './setting.js'

// Constants
/// Formatters/Converters
/// Intl
const rtf = new Intl.RelativeTimeFormat();
const dtf = new Intl.DateTimeFormat('lt-LT');
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
      if(attribute === 'events') Object.keys(attributes[attribute]).forEach(interaction => element.addEventListener(interaction, attributes[attribute][interaction]))
      else element.setAttribute(attribute, attributes[attribute])
    }
    special(element);
    return element;
  }

const fromTemplate
  = (
    template,
    templateValues
  ) => {
    const specialAttributes = ['innerHTML', 'innerText', 'outerHTML']
    let element = template.content.cloneNode(true)
    Object.keys(templateValues).forEach(item => {
      let itemElement = element.querySelector('.' + item)
      Object.keys(templateValues[item]).forEach(attribute => {
        if (attribute === 'interactions') Object.keys(templateValues[item][attribute]).forEach(interaction => {itemElement.addEventListener(interaction, templateValues[item][attribute][interaction])})
        if (attribute === 'appendChildren') templateValues[item][attribute].forEach((child) => {itemElement.appendChild(child)})
        else if(specialAttributes.includes(attribute)) itemElement[attribute] = templateValues[item][attribute]
        else itemElement.setAttribute(attribute, templateValues[item][attribute])
      })
    })
    return element
  }
const getTemplate
  = (
    template
  ) => {
    return /*fetch('../templates/post.html')*/beaker.hyperdrive.readFile(`/client/assets/templates/${template}.html`)
      //.then(response => response.text())
      .then(text => {
        return new DOMParser().parseFromString(text, 'text/html').querySelector('template')
      })
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
    return beaker.markdown.toHTML(markdown)
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
    return beaker.hyperdrive.readFile(profileLocationFromFile(file), {encoding: 'json', timeout: 1000});
  }
const writeToFile
  = (
    file,
    object
  ) => {
    return beaker.hyperdrive.writeFile(profileLocationFromFile(file), object, 'json');
  }
const locationFromFile
  = (
    file
  ) => {
    if (!Constant.acceptedFiles.includes(file)) throw 'Not an accepted file!'
    else return `/store/${file}.json`
  }
const profileLocationFromFile
  = (
    file
  ) => {
    if (!Constant.acceptedFiles.includes(file)) throw 'Not an accepted file!'
    else return `hyper://${Setting.profileDrive}${locationFromFile(file)}`
  }

export {
  newElement, fromTemplate, getTemplate,
  formatDateDifference, formatDateTime, markdownToHTML, selfAsFollow, preventHTMLInContentEditable,
  arrayFromCSV,
  readFromFile, writeToFile, locationFromFile
}