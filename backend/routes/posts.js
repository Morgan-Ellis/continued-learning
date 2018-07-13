const express = require("express");

const PostController = require("../controllers/posts");

const verifyAuth = require("../middleware/verify-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", verifyAuth, extractFile, PostController.createPost);

router.put("/:id", verifyAuth, extractFile, PostController.editPost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", verifyAuth, PostController.deletePost);

module.exports = router;
