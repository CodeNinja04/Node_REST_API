exports.getPosts = (req,res,next) => {

    res.status(200).json({
        posts:[{title:"First post",content:"This is first post "}]
    
});

};

exports.createPost = (req,res,next) => {

    const title = req.body.title;
    const content = req.body.content;

    res.json({

        message:"Post created successfully",
        post:{id: new Date().toISOString,title:title,content:content}

    });

};

