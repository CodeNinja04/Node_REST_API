const { body, validationResult } = require("express-validator");

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First post",
        content: "This is first post ",
        imageUrl: "images/image1.jpg",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
      title:title,
      content:content,
      imageUrl: "images/image1.jpg",
      creator:{name:"hemendra"}
  });

  post.save().then(result =>{
      console.log(result);
      res.status(201).json({
          message:'Post reated sucessfully',
          post:result
      })
  }).catch(err => {
      console.log(err);
  })

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message:"validation failed",errors: errors.array() });
  }

  res.status(201).json({
    message: "Post created successfully",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      createdat: new Date(),
    },
  });
};
