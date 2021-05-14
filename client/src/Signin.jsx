import React, { Component, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { authenticateUser } from "./Cognito";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    this.classes = {
      paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      form: {
        width: "100%", // Fix IE 11 issue.
      },
      submit: {},
    };
    this.state = {
      email: "",
      password: "",
      loading: false,
      redirect: false,
      whoosh: false,
    };
  }

  useLocalStorage = (info) => {
    localStorage.setItem("user", info.data);
  };

  whooshHandler = () => {
    this.setState({ whoosh: true });
    this.renderRedirect();
  };

  renderRedirect = () => {
    if (this.state.whoosh) {
      return <Redirect to="/signup" />;
    }
  };

  changeEmail(e) {
    this.setState({ email: e.target.value });
  }

  changePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleSigninSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log("Entered:", this.state);
    authenticateUser(this.state.email, this.state.password, (err, result) => {
      if (err) {
        console.log(err);
        this.setState({ loading: false });
        return;
      }
      this.useLocalStorage(result);
      this.setState({ redirect: true });
      console.log(result);
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={this.classes.paper} style={{ marginTop: 100 }}>
          <Avatar className={this.classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={this.classes.form}
            noValidate
            onSubmit={this.handleSigninSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.email}
              onChange={this.changeEmail}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.changePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <div>{this.state.redirect ? <Redirect push to="/view" /> : null}</div>
      </Container>
    );
  }
}

export default Signin;
