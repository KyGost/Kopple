import Element from './element.js'
import {newElement, formatDateDifference, formatDateTime} from './utilities.js'

class Reply extends Element {
  constructor(reply) {
    super()
    this.element = newElement(
      'reply',
      'div',
      [
          newElement(
          'identity',
          'span',
          [
              newElement(
              'avatar',
              'img',
              undefined,
              {src: reply.poster.avatar}
            ),
              newElement(
              'name',
              'span',
              reply.poster.name
            )
          ]
        ),
          newElement(
          'content',
          'span',
          reply.content
        ),
          newElement(
          'posted',
          'span',
          [
              newElement(
              'relative',
              'span',
                formatDateDifference(reply.posted)
            ),
              newElement(
              'date',
              'span',
              formatDateTime(reply.posted)
            )
          ]
        )
      ]
    )
  }
}
export default Reply