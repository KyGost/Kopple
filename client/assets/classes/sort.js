const PostByDate
  = (
    a,
    b
  ) => {
    return a.posted < b.posted ? 1 : -1;
  }
export default {PostByDate}