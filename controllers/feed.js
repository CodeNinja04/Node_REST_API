const { body, validationResult } = require("express-validator");


const Post = require('../models/post');

exports.getPost = (req, res, next) => {
  

  const postId = req.params.postId;

  Post.findById(postId).then(post =>{
    if(!post){
      const error = new Error('could not find post');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message:"post fetched",post:post})
  })
  .catch(err =>{
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createPost = (req, res, next) => {

  //console.log(req.file.path);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error= new Error('validation failed');
        error.statusCode=422;
        throw error;
    }

    // if (!req.file){
    //   const error= new Error('No image provided');
    //   error.statusCode=422;
    //   throw error
    // }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = "images/image1.jpg";//req.file.path.replace("\\", "/");
  console.log(imageUrl);
  const post = new Post({
      title:title,
      content:content,
      imageUrl: imageUrl,
      creator:{name:"hemendra"}
  });
  console.log(imageUrl);

  post.save().then(result =>{
      console.log(result);
      res.status(201).json({
          message:'Post reated sucessfully ',
          post:result
      });
  }).catch(err => {
      if (!err.statusCode){
          err.statusCode=500;
      }
      next(err);
  
  })

};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ message:"validation failed",errors: errors.array() });
//   }

//   res.status(201).json({
//     message: "Post created successfully again",
//     post: {
//       _id: new Date().toISOString(),
//       title: title,
//       content: content,
//       createdat: new Date(),
//     },
//   });
// };

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
    //   Check logged in user
    //  clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};