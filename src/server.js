const express = require('express');
var MongoClient = require('mongodb').MongoClient
var moment = require('moment');

const app = express();
const port = process.env.PORT || 5000;
const dbDayCollection = 'metrics.day'
const dbMonthCollection = 'metrics.month'
const dbReadingCollection = 'reading'

var db;

MongoClient.connect(process.env.MONGO_POWERMON_URI, function(err, client) {
  db = client.db();
});


const findMonthDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbMonthCollection);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}

const getCurrentUsage = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbReadingCollection);
  // Find some documents
  collection.find({}).sort({$natural: -1}).limit(1).toArray(function(err, docs) {
    callback(docs[0]);
  });
}


const getCurrentMonth = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbDayCollection);
  var date = moment().utc().startOf('month');
  // Find some documents
  collection.find({ts: new Date(date.toISOString())}).limit(1).toArray(function(err, docs) {
    callback(docs[0]);
  });
}


app.get('/api/current', (req, res) => {
  // Use connect method to connect to the server
  getCurrentUsage(db, function(doc) {
    res.send(doc);
  });
});

app.get('/api/currentMonth', (req, res) => {
  // Use connect method to connect to the server
  getCurrentMonth(db, function(docBeginning) {
    if (!docBeginning) {
      res.status(500).send({ error: 'Unable to retrieve month reading' })
      return;
    }

    getCurrentUsage(db, function(docReading) {
      var diff1 = docReading.t1 - docBeginning.t1;
      var diff2 = docReading.t2 - docBeginning.t2;
      var diff = (diff1 + diff2).toFixed(3)
      res.send({d_total: Number(diff)})
    });
  });
});

app.get('/api/months', (req, res) => {
  // Use connect method to connect to the server
  findMonthDocuments(db, function(docs) {
    res.send({ express: 'Hello From Express' , docs});
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
