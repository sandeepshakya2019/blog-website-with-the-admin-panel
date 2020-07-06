//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session') 

const homeStartingContent = "This is home page of my blog. i created this website using the backend technology (node.js). To get the source code of this visit the webdblog link in footer"


const app = express();

app.use(session({ 
  
    // It holds the secret key for session 
    secret: "it's a my secret key beacuase i am the best developer so it have about 20 characters", 
  
    // Forces the session to be saved 
    // back to the session store 
    resave: true, 
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true
})) 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const Post = mongoose.model("Post", postSchema);
const User =new mongoose.model("User",userSchema);


app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

var sess;

app.get("/ss-admin/adminpanel/register",function(req,res){
  res.render("register");
})
app.post("/ss-admin/adminpanel/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
    email: req.body.username,
    password: hash
    //Password: md5(req.body.password)
    })
    newUser.save(function(err){
      if(!err){
        res.render("login");
      }else{
        console.log(err);
      }
    });

  });
  
})

app.get("/admin/login", function(req, res){
   var name = req.session.name;
   console.log(name)
    if(name) {
      res.render('compose');
    }else{
      res.render('login')
    }
});
app.post("/admin/login",function(req,res){
 
  const username= req.body.username
  //const password= md5(req.body.password)
  const password= req.body.password
  
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err)
    }else{
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result){
          // result == true
          if (result === true){
             req.session.name = username
            res.render("compose");
          }else{
            res.redirect("/")
          }
      });
      

      }
          
        
      
    }
    
  });
});
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});
var posts = []
app.get("/about", function(req, res){
  Post.find({}, function(err, posts){
    console.log(posts);
    res.render("about", {posts: posts});
  });
});
app.get("/projects", function(req, res){
    Post.find({}, function(err, posts){
    res.render("projects", {posts: posts});
  });});

app.get("/contact", function(req, res){
    Post.find({}, function(err, posts){
    res.render("contact", {posts: posts});
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
