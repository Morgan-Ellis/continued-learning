const Post = require("../models/post");

//POST
exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully. ᕙʕ•ᴥ•ʔᕗ",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Unable to add post."
    });
  });
}

//GET
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.find().then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully. ʕง•ᴥ•ʔง",
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: "Currently unable to fetch posts."
    })
  });
}

//GET ONE
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found. ʕ╭ರᴥ•́ʔ"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Currently unable to fetch post."
    })
  });
}

//PUT
exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.userId
  }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Post updated successfully. ᕙʕ•ᴥ•ʔᕗ"
      });
    } else {
      res.status(401).json({
        message: "You are not authorized to edit this post. ʕ╭ರᴥಠʔ"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Currently unable to update post."
    })
  });
}

//DELETE
exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({
        message: "Post deleted. ʕᵔᴥᵔʔっ <(BYE!)"
      });
    } else {
      res.status(401).json({
        message: "You are authorized to delete this post. ʕ╭ರᴥಠʔ"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Currently unable to delete post."
    })
  });
}
