import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { createUser, verifyUser } from "./Cognito";
import { Redirect, useHistory } from "react-router";
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

class Signup extends Component {
  constructor(props) {
    super(props);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeVerifyCode = this.changeVerifyCode.bind(this);
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    this.handleVerifySubmit = this.handleVerifySubmit.bind(this);
    this.classes = {
      paper: {
        marginTop: 100,
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
      verifyCode: "",
      username: "",
      showVerification: false,
      whoosh: false,
    };
  }

  whooshHandler = () => {
    this.setState({ whoosh: true });
    this.renderRedirect();
  };

  renderRedirect = () => {
    if (this.state.whoosh) {
      return <Redirect to="/signin" />;
    }
  };

  changeEmail(e) {
    this.setState({ email: e.target.value });
  }

  changeUsername(e) {
    this.setState({ username: e.target.value });
  }

  changePassword(e) {
    this.setState({ password: e.target.value });
  }

  changeVerifyCode(e) {
    this.setState({ verifyCode: e.target.value });
  }

  handleSignupSubmit(e) {
    const { email, password } = this.state;
    e.preventDefault();
    console.log("Entered:", this.state);
    createUser(email, email, password, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      this.setState({ showVerification: true });
    });
  }

  handleVerifySubmit(e) {
    e.preventDefault();
    verifyUser(this.state.email, this.state.verifyCode, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.props.history.push("/signin");
    });
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {!this.state.showVerification ? (
          <div className={this.classes.paper} style={{ marginTop: 100 }}>
            <Avatar className={this.classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form
              className={this.classes.form}
              noValidate
              onSubmit={this.handleSignupSubmit}
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
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signin" variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        ) : (
          <div className={this.classes.paper} style={{ marginTop: 100 }}>
            <form onSubmit={this.handleVerifySubmit}>
              <input
                value={this.state.verifyCode}
                onChange={this.changeVerifyCode}
                placeholder="code"
              />
              <button type="submit">Verify</button>
            </form>
          </div>
        )}
        {/* <div>
          {this.state.redirect ? (<Redirect push to='/view' />) : null}
        </div> */}
      </Container>
    );
  }
}

export default withRouter(Signup);
