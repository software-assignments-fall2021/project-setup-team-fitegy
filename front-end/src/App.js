import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"

import CreateNew from "./Components/CreateNew/createNew.js";
import ProfileBar from "./Components/ProfileBar/ProfileBar.js";
import Feed from "./Components/feed/feed.js";
import CreateChallenge from "./Components/CreateChallenge/createChallenge.js";
import ChallengeManager from "./Components/ChallengeManager/ChallengeManager.js";
import CreatePost from "./Components/CreatePost/CreatePost.js";
import SelectPhoto from "./Components/SelectPhoto/SelectPhoto.js";
import LogIn from "./Components/LogIn/logIn.js";
import NotificationPage from "./Components/NotificationPage/NotificationPage.js";
import { Login } from "@mui/icons-material";
import Challenge from "./Components/ChallengeforProfile/ChallengeforProfile";

function App() {
  return (
    <Router>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/feed">Feed</Link>
            </li>
            <li>
              <Link to="/notification-page">Notification Page</Link>
            </li>
            <li>
              <Link to="/profile">Profile Page</Link>
            </li>
            <li>
              <Link to="/create-challenge">Create Challenge</Link>
            </li>
            <li>
              <Link to="/challenge-manager">Challenge Manager</Link>
            </li>
            <li>
              <Link to="/create-post">Create Post</Link>
            </li>
            <li>
              <Link to="/select-photo">Select Photo</Link>
            </li>
          </ul>
        </nav>

      <div id="screen">
        <Switch>
          <Route path="/login" component={LogIn} />
          <Route path="/feed" component={Feed} />
          <Route path="/notification-page" component={NotificationPage} />
          <Route path="/profile">
            <ProfileBar />
          </Route>
          <Route path="/create-challenge" component={CreateChallenge} />
          <Route path="/challenge-manager" component={ChallengeManager} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/select-photo" component={SelectPhoto} />
        </Switch>
      </div>
    </Router>
  );
}
export default App;
