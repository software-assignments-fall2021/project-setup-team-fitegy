// import and instantiate express
const express = require("express"); // CommonJS import style!
const app = express(); // instantiate an Express object

// import some useful middleware
const bodyParser = require("body-parser"); // middleware to help parse incoming HTTP POST data
const multer = require("multer"); // middleware to handle HTTP POST requests with file uploads
const axios = require("axios"); // middleware for making requests to APIs
require("dotenv").config({ silent: true }); // load environmental variables from a hidden file named .env
const morgan = require("morgan"); // middleware for nice logging of incoming HTTP requests
const PORT = process.env.PORT || 3001;
const cors = require("cors");
require('dotenv').config();

// mongoDB 
require('dotenv').config({path:'../.env'});
const mongoose = require("mongoose");
const { Schema } = mongoose;
const MONGODB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fitegy.w1f4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(MONGODB_URL);

app.use(cors());
/**
 * Typically, all middlewares would be included before routes
 * In this file, however, most middlewares are after most routes
 * This is to match the order of the accompanying slides
 */

// use the morgan middleware to log all incoming http requests
app.use(morgan("dev")); // morgan has a few logging default styles - dev is a nice concise color-coded style

// use the bodyparser middleware to parse any data included in a request
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

// make 'public' directory publicly readable with static content
app.use("/static", express.static("public"));

// the following are used for authentication with JSON Web Tokens
//const _ = require("lodash") // the lodash module has some convenience functions for arrays that we use to sift through our mock user data... you don't need this if using a real database with user info
const jwt = require("jsonwebtoken")
const passport = require("passport")
app.use(passport.initialize()) // tell express to use passport middleware

// load up some mock user data in an array... this would normally come from a database
const users = require("./user_data.js")

// use this JWT strategy within passport for authentication handling
const { jwtOptions, jwtStrategy } = require("./jwt-config.js") // import setup options for using JWT in passport
passport.use(jwtStrategy)

// a route that is protected... only authenticated users can access it.
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // our jwt passport config will send error responses to unauthenticated users will
    // so we only need to worry about sending data to properly authenticated users!

    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
      },
      message:
        "Congratulations: you have accessed this route because you have a valid JWT token!",
    })
  }
)
// Define Schema for each notification
const CredentialsSchema = new Schema({
  username: String,
  password: String
});

// Model for each notification
const Credentials = mongoose.model("Credentials", CredentialsSchema);


// function for saving the data to MongoDB
const SaveCredentialsData = async (username, password) =>{

  // create data
  const data= {
      username: username,
      password: password, 
  }

  // instance of credentials model
  const Credentials1  = new Credentials(data);

  // save this post to database
  Credentials1.save((error) =>{
      if(error){
          console.log("Oops something went wrong!")
      }
      else{
          console.log("Data saved to MongoDB!")
      }
  })
}

const findUserCredentials = async(username) =>{
  const user = await Credentials.find({username: username})
  return user
}
// a route to handle a login attempt
app.post("/login", function (req, res) {
  // grab the name and password that were submitted as POST body data
  const username = req.body.username
  const password = req.body.password
  //console.log(`${username}, ${password}`)
  if (!username || !password) {
    // no username or password received in the POST body... send an error
    res
      .status(401)
      .json({ success: false, message: `no username or password supplied.` })
  }
  findUserCredentials(username).then( (user) => {
    console.log(user)
    console.log(req.body.password)
    console.log(user[0].password)
    // usually this would be a database call, but here we look for a matching user in our mock data
    if (!user) {
      // no user found with this name... send an error
      res
        .status(401)
        .json({ success: false, message: `user not found: ${username}.` })
    }

    // assuming we found the user, check the password is correct
    // we would normally encrypt the password the user submitted to check it against an encrypted copy of the user's password we keep in the database... but here we just compare two plain text versions for simplicity

    else if (req.body.password == user[0].password) {
      // the password the user entered matches the password in our "database" (mock data in this case)
      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
      const payload = { id: user.id } // some data we'll encode into the token
      const token = jwt.sign(payload, jwtOptions.secretOrKey) // create a signed token
      console.log(token)
      res.json({ success: true, username: user.username, token: token }) // send the token to the client to store
    } else {
      // the password did not match
      res.status(401).json({ success: false, message: "passwords did not match" })
    }
  })
})
// a route to handle logging out users
app.get("/logout", function (req, res) {
  // nothing really to do here... logging out with JWT authentication is handled entirely by the front-end by deleting the token from the browser's memory
  res.json({
    success: true,
    message:
      "There is actually nothing to do on the server side... you simply need to delete your token from the browser's local storage!",
  })
})
// route for HTTP GET requests to the root document

app.get("/", (req, res) => {
  res.send("Hello! This is the server for Fitegy.");
});

app.use("/api/feed", require("./routes/feed.js"));
app.use("/api/challenge", require("./routes/challenge.js"));
app.use("/api/notifications", require("./routes/notification.js"));
app.use("/api/createChallenge", require("./routes/createChallenge.js"));
app.use("/api/profile", require("./routes/profile.js"));
app.use("/api/createPost", require("./routes/createPost.js"));
app.use("/api/joined", require("./routes/joined"));
app.use("/api/liked", require("./routes/countLikes.js"));
app.use("/api/settings", require("./routes/settings.js"));

// export the express app we created to make it available to other modules
module.exports = app; // CommonJS export style
