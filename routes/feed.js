const express = require("express");
const {body,validationResult} = require("express-validator");
const feedController = require("../controllers/feed");
const router = express.Router();
const isAuth = require("../middleware/is-auth");


router.get("/posts",isAuth, feedController.getPosts);

router.post(
  "/post",
  
   [ body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 })],
  
  
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);


router.put(
  "/post/:postId",isAuth,
  
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
