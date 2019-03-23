var Forum = require('./forum');

module.exports = {

  savePost: function (post, sucessCB, failureCB) {

    if (!post) {
      failureCB();
    } else {
      let newPost = new Forum({
        patient_username: post.patient_username,
        question: post.question,
        category: post.category,
        date: post.date
      });
      // save the user
      newPost.save(function (err, pst) {
        if (err) {
          failureCB();
        } else {
          sucessCB(pst);
        }
      });
    }

  },

  saveComment: function (comment, question_id, sucessCB, failureCB) {

    if (!comment) {
      failureCB();
    } else {
      Forum.findById(question_id, function (err, forum) {
        if (err) {
          failureCB();
        } else {
          let com = forum.comments;
          com.push(comment);
          forum.update({
            comments: com
          }, function (err, forum) {
            if (err) {
              failureCB();
            } else {
              sucessCB();
            }
          });
        }
      });

    }

  },

  fetchPosts: function (patient_username, sucessCB, failureCB) {
    Forum.find({
        patient_username: patient_username
      },
      function (err, psts) {
        if (err) {
          failureCB();
        } else {
          sucessCB(psts);
        }
      });
  },

  getPost: function (post_id, sucessCB, failureCB) {
    Forum.findOne({
        _id: post_id
      },
      function (err, post) {
        if (err) {
          failureCB();
        } else {
          sucessCB(post);
        }
      });
  },

  searchPosts: function (search_term, sucessCB, failureCB) {

    Forum.$where(() => {
        return (this.question.search(search_term) !== -1);
      }).limit(7).sort({
        date: 'desc'
      })
      .exec(function (err, psts) {
        if (err) {
          failureCB();
        } else {
          sucessCB(psts);
        }
      });

  }

}