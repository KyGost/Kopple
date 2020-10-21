import Element from './element.js'
import {newElement, formatDateDifference, formatDateTime, markdownToHTML, preventHTMLInContentEditable} from './utilities.js'

import State from './state.js'

class Post extends Element {
  constructor(post) {
    super()
    this.post = post
    let options = []
      if(post.poster.address === location.hostname) options.push(newElement(
        'dropdown-item',
        'li',
        'Edit',
        undefined,
        (element) => {
          element.addEventListener('click', () => {
            State.refreshFeed = false;

            const restorePost = () => {
              this.element.removeChild(buttons);
              this.contentElement.removeAttribute('contentEditable');
              State.refreshFeed = true;
              this.contentElement.innerHTML = markdownToHTML(this.contentElement.innerText);
            };
            this.contentElement.contentEditable = true;
            this.contentElement.addEventListener('keydown', preventHTMLInContentEditable);
            let save = newElement(
              'save',
              'button',
              'Save',
              undefined,
              (element) => {
                element.addEventListener('click', () => {
                  let changePost = store.files.feed.find(postCheck => postCheck.identity === post.identity)
                  changePost.content = this.contentElement.innerText
                  changePost.updated = new Date().getTime()
                  store.saveFiles()
                  post.content = changePost.content // Solution for double editing
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
            this.contentElement.innerText = post.content; // I was originally using showdown. It doesn't use commonmark unfrotunately. This means I cannot convert HTML back to markdown. This means double editing entails simply changing post variable content, this is a bit less nice but almost better in a weird way.
            this.element.appendChild(buttons);
          });
        }
      ));
      if(post.poster.address === location.hostname) options.push(newElement(
        'dropdown-item',
        'li',
        'Delete',
        undefined,
        (element) => element.addEventListener('click', () => {
          let postIndex = store.files.feed.indexOf(store.files.feed.find(postCheck => postCheck.identity === post.identity));
          store.files.feed.splice(postIndex, 1); // TODO: Should be improved
          store.saveFiles();
          this.element.parentElement.removeChild(this.element);
        })
      ));
    this.element = newElement(
      'post',
      'div',
      [
        newElement(
          'identity',
          'div',
          [
            newElement(
              'avatar',
              'img',
              undefined,
              {src: post.poster.avatar}
            ),
            newElement(
              'whowhen',
              'div',
              [
                newElement(
                  'poster',
                  'span',
                  post.poster.name
                ),
                newElement(
                  'posted',
                  'span',
                  [
                    newElement(
                      'relative',
                      'span',
                      formatDateDifference(post.posted)
                    ),
                    newElement(
                      'date',
                      'span',
                      formatDateTime(post.posted)
                    )
                  ]
                )
              ]
            )
          ]
        ),
        newElement(
          'alterPostButton',
          'button',
          '&#8285;'
        ),
        newElement(
          'dropdown',
          'ul',
          options
        ),
        (this.contentElement = newElement(
          'content',
          'div',
          markdownToHTML(post.content)
        )),
        newElement(
          'interact',
          'div',
          [
            newElement(
              'repost',
              'button',
              '&#8617; Repost',
              {disabled: true}
            ),
            newElement(
              'reply',
              'button',
              '&#128488; Reply',
              undefined,
              (
                element
              ) => {
                element.addEventListener('click', (
                  ) => {
                    this.element.classList.add('hasReplies')
                  }
                )
              }
            )
          ]
        ),
        newElement(
          'replies',
          'div',
          [
            newElement(
              'new',
              'div',
              [
                (this.replyContentElement = newElement(
                  'textarea',
                  'span',
                  undefined,
                  {
                    contentEditable: true,
                    placeholder: 'New reply'
                  }
                )),
                newElement(
                  'postButton',
                  'button',
                  'Post',
                  undefined,
                  (element) => element.addEventListener('click', () => {
                    let content = this.replyContentElement.innerText;
                    let postElementID = this.element.id;
                    let postElementIDParts = postElementID.split('-');
                    let address = postElementIDParts[1];
                    let postIdentity = postElementIDParts[2];
                    store.files.interactions.push({
                      address: address,
                      postIdentity: postIdentity,
                      type: 'reply',
                      posted: new Date().getTime(),
                      content: content
                    })
                    store.saveFiles();
                    this.replyContentElement.innerText = '';
                  })
                )
              ]
            )
          ]
        )
      ],
      {id: ['post', post.poster.address, post.identity].join('-')}
    )
  }
}
export default Post