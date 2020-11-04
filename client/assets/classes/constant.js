const Constant = {
  id: {
    feedID: 'feed',
    feedNewPostID: 'feed' + 'NewPost' // TODO: Maybe I can reference feedID somehow?
  },
  acceptedFiles: [
    'follows',
    'ignores',
    'feed',
    'interactions',
    'self',
    'filters',
  ],
  IOTimeout: 10000,
  dataDefault: {
    post: {
      identity: -1,
      content: '',
      topics: '',
      filters: '',
      posted: 0
    },
    interaction: {
      address: '',
      postIdentity: -1,
      type: '',
      posted: 0,
      content: ''
    },
    self: {
      name: 'Unknown',
      avatar: "data:image/svg+xml;utf8,<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-person-fill' fill='white' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/></svg>"
    }
  }
}
export default Constant