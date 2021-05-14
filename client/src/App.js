import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Editor from "./editor.js";
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import Home from "./Home.js";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isUserAuthenticated: false,
    };
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.isUserAuthenticated ? (
                <Redirect to="/view" />
              ) : (
                <Redirect to="/signin" />
              );
            }}
          />
          <Route exact path="/editor/:docId">
            <Editor />
          </Route>
          <Route exact path="/view">
            <Home />
          </Route>
          <Route exact path="/signin">
            <Signin />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
        </Switch>
      </Router>
    );
  }
}
