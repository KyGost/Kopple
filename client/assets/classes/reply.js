import Element from './element.js'
import {newElement, fromTemplate, formatDateDifference, formatDateTime} from './utilities.js'

let template
/*fetch('../templates/post.html')*/beaker.hyperdrive.readFile('/client/assets/templates/reply.html')
  //.then(response => response.text())
  .then(text => {
    template = new DOMParser().parseFromString(text, 'text/html').querySelector('template')
  })
class Reply extends Element {
  constructor(reply) {
    super()
    this.element = fromTemplate(
      template,
      {
        avatar: {src: reply.poster.avatar},
        name: {innerText: reply.poster.name},
        content: {innerText: reply.content},
        relative: {innerText: formatDateDifference(reply.posted)},
        date: {innerText: formatDateTime(reply.posted)}
      }
    )
  }
}
export default Reply