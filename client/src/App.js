import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Editor from './editor.js';
import { createDoc, deleteDoc, getDocList, shareDoc } from './util.js';

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
  const userID = "userID";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await getDocList(userID);
    setData({ docs: result.data });
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Cooper Docs
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.docContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              {"Welcome " + userID}
            </Typography>
          </Container>
        </div>
        <Container maxWidth="sm">
          <Button onClick={() => createDoc(userID).then(() => getDocList(userID).then(result => setData({ docs: result.data })))} variant="contained" color="primary">
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
                      getDocList(userID).then(result => setData({ docs: result.data }));
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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/editor/:docId">
          <Editor />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}