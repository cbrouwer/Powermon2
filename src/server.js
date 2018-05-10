const express = require('express');
var MongoClient = require('mongodb').MongoClient

const app = express();
const port = process.env.PORT || 5000;
const dbDayCollection = 'metrics.day'
const dbMonthCollection = 'metrics.month'


const findMonthDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbMonthCollection);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}


app.get('/api/months', (req, res) => {
  // Use connect method to connect to the server
  MongoClient.connect(process.env.MONGO_POWERMON_URI, function(err, client) {

    const db = client.db();

    findMonthDocuments(db, function(docs) {
      res.send({ express: 'Hello From Express' , docs});
      client.close();
    });

  });


});

app.listen(port, () => console.log(`Listening on port ${port}`));
