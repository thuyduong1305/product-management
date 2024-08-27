module.exports = (find, query) => {
  if (query.keyword) {
    const regex = new RegExp(query.keyword, "i");
    find.title = regex;
  }
  return find;
};
