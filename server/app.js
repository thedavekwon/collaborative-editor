var http = require('http');
const cors = require('cors');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
const { MongoClient, ObjectID } = require('mongodb');
const { title } = require('process');

const mongo = '127.0.0.1';
// const mongo = "mongo"
const uri = `mongodb://${mongo}:27017/test`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

ShareDB.types.register(richText.type);

const db = require('sharedb-mongo')(uri);
var backend = new ShareDB({ db });

var app = express();
app.use(cors())
app.use(express.static('static'));
app.use(express.static('node_modules/quill/dist'));

var connection = backend.connect();

// Create a web server to serve files and listen to WebSocket connections
var server = http.createServer(app);

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws, req) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

app.get('/edit/:id', function (req, res) {
  var doc = connection.get('documents', req.params.id);
  doc.fetch(function (err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ insert: 'Hi!' }], 'rich-text');
      return;
    }
  });
  res.json({ output: "created" });
});

app.get('/user/create/:userId', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('user').insertOne({
    _id: req.params.userId,
  });
  await doc;
  res.json({ output: "created" });
});

app.get('/doc/create/:userId', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('doc').insertOne({
    owner: req.params.userId,
    accessIds: [req.params.userId]
  });
  await doc;
  res.json({ output: "created" });
});

app.get('/doc/share/:userId-:docId', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('doc').updateOne({ _id: new ObjectID(req.params.docId) }, {
    $push: { accessIds: req.params.userId }
  });
  await doc;
  res.json({ output: "created" });
});

app.get('/doc/updatetitle/:docId-:title', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('doc').updateOne({ _id: new ObjectID(req.params.docId) }, {
    $set: {
      title: req.params.title
    }
  });
  await doc;
  res.json({ output: "updated" });
});

app.get('/doc/delete/:docId', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('doc').deleteOne({
    _id: new ObjectID(req.params.docId)
  });
  await doc;
  res.json({ output: "deleted" });
});

app.get('/doc/getlist/:userId', async function (req, res) {
  await client.connect();
  const userDocumentList = await client.db().collection('doc').find(
    { accessIds: req.params.userId }
  );
  // userDocumentList.forEach(doc => console.log(doc));
  // res.json(userDocumentList);
  const docs = [];
  await userDocumentList.forEach(doc => docs.push(doc));
  res.send(docs);
});

app.get('/doc/get/:docId', async function (req, res) {
  await client.connect();
  const doc = await client.db().collection('doc').findOne(
    { _id: new ObjectID(req.params.docId) }
  );
  await doc;
  res.send(doc);
});

server.listen(8080);
console.log('Listening on http://localhost:8080');