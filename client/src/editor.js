import React, { useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";
import Sharedb from "sharedb/lib/client";
import richText from "rich-text";
import { Button, Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { getDoc, updateDocTitle } from "./util.js";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";

const axios = require("axios");
const server = window.location.hostname;
Sharedb.types.register(richText.type);

function Editor() {
  let { docId } = useParams();
  const socket = new WebSocket(`ws://${server}:8080/edit/` + docId);
  const connection = new Sharedb.Connection(socket);

  const Http = new XMLHttpRequest();
  const url = `http://${server}:8080/edit/` + docId;
  axios.get(url, { crossdomain: true });

  const [title, setTitle] = useState(null);
  // Querying for our document
  const doc = connection.get("documents", docId);
  let history = useHistory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await getDoc(docId);
    setTitle(result?.data?.title);
    console.log(result);
    console.log(title);
    console.log(result.data);
  }, []);

  useEffect(() => {
    doc.subscribe(function (err) {
      if (err) throw err;

      const toolbarOptions = ["bold", "italic", "underline", "strike", "align"];
      const options = {
        theme: "bubble",
        modules: {
          toolbar: toolbarOptions,
        },
      };
      let quill = new Quill("#editor", options);
      /**
       * On Initialising if data is present in server
       * Updaing its content to editor
       */
      quill.setContents(doc.data);

      /**
       * On Text change publishing to our server
       * so that it can be broadcasted to all other clients
       */
      quill.on("text-change", function (delta, oldDelta, source) {
        if (source !== "user") return;
        doc.submitOp(delta, { source: quill });
      });

      /** listening to changes in the document
       * that is coming from our server
       */
      doc.on("op", function (op, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    });
    return () => {
      connection.close();
    };
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ textAlign: "left", alignRight: true }}
            variant="h6"
            color="inherit"
            noWrap
          >
            Cooper Docs
          </Typography>
          <div>
            <Button
              style={{ textAlign: "end", marginLeft: 10, marginRight: 10 }}
              onClick={() => {
                history.push("/view");
              }}
              variant="contained"
              color="secondary"
            >
              Home
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
      <Container>
        <div
          style={{
            textAlign: "center",
            margin: "5%",
          }}
        >
          <Box>
            <TextField
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                updateDocTitle(docId, e.target.value);
              }}
            />
          </Box>
        </div>
        <div style={{ margin: "5%", border: "1px solid" }}>
          <div id="editor"></div>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Editor;
