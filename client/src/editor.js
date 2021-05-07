import React, { useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import { Button, Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom';
import {
  Link
} from "react-router-dom";

import { getDoc, updateDocTitle } from './util.js';

const axios = require('axios');
const server = window.location.hostname;
Sharedb.types.register(richText.type);

function Editor() {
  let { docId } = useParams();
  console.log(docId);
  // Connecting to our socket server
  const socket = new WebSocket(`ws://${server}:8080/edit/` + docId);
  const connection = new Sharedb.Connection(socket);

  const Http = new XMLHttpRequest();
  const url = `http://${server}:8080/edit/` + docId;
  axios.get(url, { crossdomain: true });

  const [data, setData] = useState({ docs: null });
  // Querying for our document
  const doc = connection.get('documents', docId);

  useEffect(async () => {
    const result = await getDoc(docId);
    setData({ doc: result.data });
    console.log(result.data);
  }, []);

  useEffect(() => {
    doc.subscribe(function (err) {
      if (err) throw err;

      const toolbarOptions = ['bold', 'italic', 'underline', 'strike', 'align'];
      const options = {
        theme: 'bubble',
        modules: {
          toolbar: toolbarOptions,
        },
      };
      let quill = new Quill('#editor', options);
      /**
       * On Initialising if data is present in server
       * Updaing its content to editor
       */
      quill.setContents(doc.data);

      /**
       * On Text change publishing to our server
       * so that it can be broadcasted to all other clients
       */
      quill.on('text-change', function (delta, oldDelta, source) {
        if (source !== 'user') return;
        doc.submitOp(delta, { source: quill });
      });

      /** listening to changes in the document
       * that is coming from our server
       */
      doc.on('op', function (op, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    });
    return () => {
      connection.close();
    };
  }, []);

  return (
    <Container>
      <Button><Link to={"/"}>Home</Link></Button>
      <Button>Share</Button>
      <div style={{
        'textAlign': 'center',
      }}>
        <TextField value={data?.doc?.title} onChange={(e) => {
          updateDocTitle(docId, e.target.value)
        }} />
      </div>
      <div style={{ margin: '5%', border: '1px solid' }}>
        <div id='editor'></div>
      </div>
    </Container>
  );
}

export default Editor;
