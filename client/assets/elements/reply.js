import Element from './element.js'
import ReplyTemplate from './replyTemplate.js'
import {newElement, fromTemplate, getTemplate, formatDateDifference, formatDateTime} from '../classes/utilities.js'

class Reply extends Element {
  constructor(reply) {
    super()
    this.element = fromTemplate(
      ReplyTemplate,
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