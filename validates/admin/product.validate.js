module.exports.createPost = async (request, response, next) => {
  if (!request.body.title) {
    request.flash("error", "Title must NOT be empty!");
    response.redirect("back");
    return;
  }

  if (request.body.title.length < 5) {
    request.flash("error", "Title must have AT LEAST 5 characters!");
    response.redirect("back");
    return;
  }

  next();
};
