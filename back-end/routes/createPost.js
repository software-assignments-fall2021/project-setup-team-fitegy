const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post("/", (req, res) => {
    const title = req.body.title
    const content = req.body.content
    const isPrivate = req.body.isPrivate
    // now do something amazing with this data...
    // ... then send a response of some kind
    console.log(req.body);
    res.send("User Input Received");
  })


module.exports = router;