import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import {
  createDoc,
  deleteDoc,
  getDocList,
  shareDoc,
  getUserList,
} from "./util.js";
import { getCurrentUser } from "./Cognito";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  docContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  docButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export function Home() {
  const classes = useStyles();
  const [data, setData] = useState({ docs: [] });
  const [user, setUser] = useState({ id: null });
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  const handleClickOpen = (doc) => {
    setOpen(true);
    setSelectedDoc(doc);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeEmail = (e) => {
    setShareEmail(e.target.value);
  };

  let history = useHistory();

  useEffect(() => {
    getCurrentUser((attributes) => {
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].Name === "email") {
          setUser({ id: attributes[i].Value });
        }
      }
    });
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      <Redirect to="/signin" />;
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await getDocList(user.id);
    setData({ docs: result.data });
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      <Redirect to="/signin" />;
    }
  }, [user.id]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <Typography
              style={{
                textAlign: "left",
                alignRight: true,
                marginLeft: 10,
                marginRight: 20,
              }}
              variant="h6"
              color="inherit"
            >
              Cooper Docs
            </Typography>
            <Typography
              style={{
                textAlign: "left",
                alignRight: true,
                marginLeft: 10,
                marginRight: 10,
              }}
              variant="h6"
              color="inherit"
            >
              {user.id}
            </Typography>
          </div>
          <div>
            <Button
              style={{ textAlign: "end", marginLeft: 10, marginRight: 10 }}
              onClick={() =>
                createDoc(user.id).then(() =>
                  getDocList(user.id).then((result) =>
                    setData({ docs: result.data })
                  )
                )
              }
              variant="contained"
              color="secondary"
            >
              Create New Document
            </Button>
            <Button
              style={{ textAlign: "end", marginLeft: 10, marginRight: 10 }}
              onClick={() => {
                localStorage.clear();
                history.push("/signin");
              }}
              variant="contained"
              color="secondary"
            >
              Sign Out
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {data.docs.map((doc) => (
              <Grid item key={doc._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doc.title || "Doc Title"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        history.push("/editor/" + doc._id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() =>
                        deleteDoc(doc._id).then((response) => {
                          getDocList(user.id).then((result) =>
                            setData({ docs: result.data })
                          );
                        })
                      }
                      size="small"
                      color="primary"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        handleClickOpen(doc);
                      }}
                      size="small"
                      color="primary"
                    >
                      Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Cooper Union
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Share Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter other accounts to share document.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={shareEmail}
            onChange={changeEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (shareEmail === "" || selectedDoc == null) return;
              console.log(shareEmail);
              console.log(selectedDoc);
              shareDoc(shareEmail, selectedDoc._id);
              setShareEmail("");
              handleClose();
            }}
            color="primary"
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Home;
