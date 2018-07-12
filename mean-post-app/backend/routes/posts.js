const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const verifyAuth = require("../middleware/verify-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//POST
router.post(
  "",
  verifyAuth,
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
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
);

//GET
router.get("", (req, res, next) => {
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
});

//GET ONE
router.get("/:id", (req, res, next) => {
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
});

//PUT
router.put(
  "/:id",
  verifyAuth,
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
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
      if (result.nModified > 0) {
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
);

//DELETE
router.delete("/:id", verifyAuth, (req, res, next) => {
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
});

module.exports = router;
