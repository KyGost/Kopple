import Element from './element.js'
import PostTemplate from './postTemplate.js'
import {newElement, fromTemplate, getTemplate, formatDateDifference, formatDateTime, markdownToHTML, preventHTMLInContentEditable} from '../classes/utilities.js'

import State from '../classes/state.js'
import Setting from '../classes/setting.js'

class Post extends Element {
  constructor(post) {
    super()
    this.post = post
    this.element = fromTemplate(
      PostTemplate,
      {
        post: {id: ['post', post.poster.address, post.identity].join('-'), posted: post.posted},
        poster: {innerText: post.poster.name},
        avatar: {src: post.poster.avatar},
        relative: {innerText: formatDateDifference(post.posted)},
        date: {innerText: formatDateTime(post.posted)},
        content: {innerHTML: markdownToHTML(post.content)},
        reply: {interactions: {click: () => {this.element.classList.add('hasReplies')}}},
        postButton: {interactions: {click: this.postReplyClick}}
      }
    ).querySelector('.post')
    this.decideOptions(post)
    this.options.forEach(option => this.element.querySelector('.options').appendChild(option))
  }
  options = [
    newElement(
      'dropdown-item',
      'li',
      'Permalink',
      undefined,
      (element) => element.addEventListener('click', this.permalinkClick)
    )
  ]
  decideOptions = (post) => {
    if(post.poster.address === Setting.profileDrive) this.options = this.options.concat([
      newElement(
        'dropdown-item',
        'li',
        'Edit',
        undefined,
        (element) => {
          element.addEventListener('click', this.editClick);
        }
      ),
      newElement(
        'dropdown-item',
        'li',
        'Delete',
        undefined,
        (element) => element.addEventListener('click', this.deleteClick)
      )
    ])
  }
  permalinkClick
    = (
    ) => {
      location.hash = '#POST:' + [this.post.poster.address, this.post.identity].join('-')
    }
  editClick
    = (
    ) => {
      State.refreshFeed = false;

      const restorePost = () => {
        this.element.removeChild(buttons);
        this.element.querySelector('.content').removeAttribute('contentEditable');
        State.refreshFeed = true;
        this.element.querySelector('.content').innerHTML = markdownToHTML(this.element.querySelector('.content').innerText);
      }
      this.element.querySelector('.content').contentEditable = true;
      this.element.querySelector('.content').addEventListener('keydown', preventHTMLInContentEditable);
      let save = newElement(
        'save',
        'button',
        'Save',
        undefined,
        (element) => {
          element.addEventListener('click', () => {
            let changePost = store.files.feed.find(postCheck => postCheck.identity === this.post.identity)
            changePost.content = this.element.querySelector('.content').innerText
            changePost.updated = new Date().getTime()
            store.saveFiles()
            this.post.content = changePost.content // Solution for double editing
            restorePost()
          })
        }
      );
      let cancel = newElement(
        'cancel',
        'button',
        'Cancel',
        undefined,
        (element) => element.addEventListener('click', restorePost)
      );
      let buttons = newElement(
        'buttons',
        'div',
        [save, cancel]
      );
      this.element.querySelector('.content').innerText = this.post.content; // I was originally using showdown. It doesn't use commonmark unfrotunately. This means I cannot convert HTML back to markdown. This means double editing entails simply changing post variable content, this is a bit less nice but almost better in a weird way.
      this.element.appendChild(buttons);
    }
  deleteClick
    = (
    ) => {
      let postIndex = store.files.feed.indexOf(store.files.feed.find(postCheck => postCheck.identity === this.post.identity))
      store.files.feed.splice(postIndex, 1) // TODO: Should be improved
      store.saveFiles()
      this.element.parentElement.removeChild(this.element)
    }
  postReplyClick
    = (
    ) => {
      let content = this.element.querySelector('.replies>.new>.textarea').innerText
      let postElementID = this.element.id
      let postElementIDParts = postElementID.split('-')
      let address = postElementIDParts[1]
      let postIdentity = postElementIDParts[2]
      store.files.interactions.push({
        address: address,
        postIdentity: postIdentity,
        type: 'reply',
        posted: new Date().getTime(),
        content: content
      })
      store.saveFiles();
      this.element.querySelector('.replies>.new>.textarea').innerText = ''
    }
}
export default Post