import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Redirect
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom"

import { createDoc, deleteDoc, getDocList, shareDoc } from './util.js';
import { handleSignout, getCurrentUser } from './Cognito'
import { ListItemAvatar } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
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
  let history = useHistory()

  useEffect(() => {
    getCurrentUser(attributes => {
      console.log(attributes);
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].Name === 'email') {
          setUser({ id: attributes[i].Value });
        }
      }
    });
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      <Redirect to='/signin' />
    }
  }, []);

  useEffect(async () => {
    console.log(data);
    const result = await getDocList(user.id);
    setData({ docs: result.data });
    console.log(data);
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      <Redirect to='/signin' />
    }
  }, [user.id]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Cooper Docs
            </Typography>
          <Button onClick={() => { history.push("/signin"); }} variant="contained" color="primary">
            Sign Out
            </Button>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.docContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              {"Welcome " + user.id}
            </Typography>
          </Container>
        </div>
        <Container maxWidth="sm">
          <Button onClick={() => createDoc(user.id).then(() => getDocList(user.id).then(result => setData({ docs: result.data })))} variant="contained" color="primary">
            Create New Doc
            </Button>
        </Container>
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
                    <Button size="small" color="primary">
                      <Link to={"/editor/" + doc._id}>Edit</Link>
                    </Button>
                    <Button onClick={() => deleteDoc(doc._id).then(response => {
                      getDocList(user.id).then(result => setData({ docs: result.data }));
                    })} size="small" color="primary">
                      Delete
                      </Button>
                    <Button onClick={() => shareDoc("user2", doc._id).then(response => console.log(response))} size="small" color="primary">
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
    </React.Fragment>
  );
}

export default Home;

