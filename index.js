//Require modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const knox = require('knox');
const fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static('./public'));
app.use(express.static('./uploads'));

//Setting upload images ========================================================

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads/images');
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

// Upload route=================================================================

app.post('/upload', uploader.single('file'), (req, res) => {
  if (req.file) {
    console.log("here is req.file", req.file)
    s3.upload(req.file).then(() => {
      db.insertImage(req.file.filename, req.body.username, req.body.title, req.body.description)
    }).then(() => {
      res.json({
        success: true
      })
    })
  } else {
    res.json({
      success: false
    })
  };
});

//GET images ==================================================================

app.get('/images', (req, res) => {
  return db.getImages().then((results) => {
    res.json(results);

  }).catch((err) =>
    console.log(err))
});

//GET single image =============================================================
app.get('/image/:imageId', (req, res) => {
  Promise.all([
    db.getSingleImage(req.params.imageId),
    db.getComments(req.params.imageId)
  ]).then((results) => {
    res.json(results)
  }).catch((err) => {
    console.log(err)
  })

});

//INSERT comments===============================================================
app.post('/singleImage/', (req, res) => {
  db.insertComment(req.body.imageId, req.body.comment, req.body.author).then(() =>
    res.json({
      success: true
    })
  )
});


app.get('/')
app.listen(8080, () => console.log(`I'm listening.`));
