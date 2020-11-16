const templateString = `
<template>
  <div class="reply">
    <span class="identity">
      <img class="avatar"/>
      <span class="name"></span>
    </span>
    <span class="content"></span>
    <span class="posted">
      <span class="relative"></span>
      <span class="date"></span>
    </span>
  </div>
</template>
`;
export default new DOMParser()
  .parseFromString(templateString, "text/html")
  .querySelector("template");
