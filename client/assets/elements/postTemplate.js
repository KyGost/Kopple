const templateString = `
<template>
  <div class="post">
      <div class="identity">
        <img class="avatar"/>
        <div class="whowhen">
          <span class="poster"></span>
          <span class="posted">
            <span class="relative"></span>
            <span class="date"></span>
          </span>
        </div>
      </div>
      <button class="alterPostButton">⁝</button>
      <ul class="options dropdown">
        <li class="dropdown-item optionPermalink">Permalink</li>
        <li class="dropdown-item optionEdit">Edit</li>
        <li class="dropdown-item optionDelete">Delete</li>
      </ul>
      <div class="content"></div>
      <div class="interact">
        <button class="repost" disabled="true">↩ Repost</button>
        <button class="reply">🗨 Reply</button>
      </div>
      <div class="replies">
        <div class="new">
          <span class="textarea" contenteditable="true" placeholder="New reply"></span>
          <button class="postButton">Post</button>
        </div>
        <div class="showAllButton" onclick="this.parentElement.classList.add('showAll')">
          <span>Show all</span>
        </div>
      </div>
  </div>
</template>
`
const template = new DOMParser().parseFromString(templateString, 'text/html').querySelector('template')
export default template