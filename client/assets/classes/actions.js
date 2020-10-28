import Constant from './constant.js'
import Theme from './theme.js'

import fetch from '../bundles/api-beaker-polyfill-datfetch.js'

import {profileLocationFromFile} from './utilities.js'

const loadTheme
  = (
    theme
  ) => {
    let themeObject = Theme[theme]
    console.log(theme, Theme, Theme[theme])
    Object.keys(themeObject).forEach(variable => {
      document.documentElement.style.setProperty(variable, themeObject[variable])
    })
  }

const resetFiles
  = async (
  ) => {
    for(var i = 0; i < Constant.acceptedFiles.length; i++) {
      let file = Constant.acceptedFiles[i];
      let content = file == 'self' ? [{}] : [];
      await fetch(profileLocationFromFile(file), {method: 'PUT', body: JSON.stringify(content)})
    }
    location.reload();
  }

export default {loadTheme, resetFiles}