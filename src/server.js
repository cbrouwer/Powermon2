const express = require('express');
var MongoClient = require('mongodb').MongoClient
var moment = require('moment');
var bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 5000;
const dbDayCollection = 'metrics.day';
const dbMonthCollection = 'metrics.month';
const dbReadingCollection = 'reading';
const dbMeterCollection = 'meter.definition';
const dbMeterReadingCollection = 'meter.reading';

app.use(bodyParser.json())


// Set up DB
var db;
MongoClient.connect(process.env.MONGO_POWERMON_URI, function(err, client) {
  db = client.db();
});

// smartmeter functions
const smartmeter_allMonths = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbMonthCollection);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}

const smartmeter_lastReading = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbReadingCollection);
  // Find some documents
  collection.find({}).sort({$natural: -1}).limit(1).toArray(function(err, docs) {
    callback(docs[0]);
  });
}


const smartmeter_currentMonth = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(dbDayCollection);
  var date = moment().utc().startOf('month');
  // Find some documents
  collection.find({ts: new Date(date.toISOString())}).limit(1).toArray(function(err, docs) {
    callback(docs[0]);
  });
}

// General functions
const insertMeter = function(db, obj, callback) {
  const collection = db.collection(dbMeterCollection);
  collection.insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("res " + res);
    callback(res._id);
  });
}
const getMeters = function(db, callback) {
  const collection = db.collection(dbMeterCollection);
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}

const addMeterReading = function(db, readingObj, callback) {
  const collection = db.collection(dbMeterReadingCollection);

  collection.insertOne(readingObj, function(err, res) {
    if (err) throw err;
    callback(res[0]._id);
  });
}

const getMeterReading = function(db, meter, callback) {
  const collection = db.collection(dbMeterReadingCollection);
  collection.find({'meter': meter}).toArray(function(err, docs) {
    callback(docs);
  });
}





app.post('/api/meter', (req, res) => {
  var myobj = req.body;
  if (!myobj) {
    throw new Error('Missing meter');
  }
  insertMeter(db, myobj, function(id) {
    res.send({insert: true})
  });
});

app.get('/api/meters', (req, res) => {
  getMeters(db, function(docs) {
    res.send(docs);
  });
});

app.get('/api/meterReading', (req, res) => {
  var meter = req.body.meter;
  if (!meter) {
    throw new Error({'error':'Missing meter'});
  }
  getMeterReading(db, meter, function(docs) {
    res.send(docs);
  });
});

app.post('/api/meterReading', (req, res) => {
  var reading = req.body;
  if (!readingObj['meter']) {
    throw new Error({'error':'Missing meter'});
  }
  addMeterReading(db, reading, function(docs) {
    res.send({insert: true})
  });
});


app.get('/api/smartmeter/elec/current', (req, res) => {
  // Use connect method to connect to the server
  smartmeter_lastReading(db, function(doc) {
    res.send(doc);
  });
});

app.get('/api/smartmeter/elec/currentMonth', (req, res) => {
  // Use connect method to connect to the server
  smartmeter_currentMonth(db, function(docBeginning) {
    if (!docBeginning) {
      res.status(500).send({ error: 'Unable to retrieve month reading' })
      return;
    }
    // Get current t1/t2 from last reading
    smartmeter_lastReading(db, function(docReading) {
      var diff1 = docReading.t1 - docBeginning.t1;
      var diff2 = docReading.t2 - docBeginning.t2;
      var diff = (diff1 + diff2).toFixed(3)
      res.send({d_total: Number(diff)})
    });
  });
});
app.get('/api/smartmeter/elec/history-months', (req, res) => {
  // Use connect method to connect to the server
  smartmeter_allMonths(db, function(docs) {
    res.send({ express: 'Hello From Express' , docs});
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
