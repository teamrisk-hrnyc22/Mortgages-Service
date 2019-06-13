const sqlite3 = require('sqlite3').verbose();



const getPriceFromDB = function(err, callback) {
  const randomId = Math.floor(Math.random() * 100) + 1;

  let db = new sqlite3.Database('data/fakePrices.sql', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the fakePrices file');
  });


  let queryString = `SELECT * FROM Prices WHERE rowId=${randomId}`;
  db.serialize(function() {
    db.get( queryString, function( err, result) {
      if (err) {
        console.log('this is the err', err);
      }
      console.log(`this is the result ${JSON.stringify(result)}`);
      callback(result);
    });
  });
};

const randomId = Math.floor(Math.random() * 100) + 1;

const byIdgetPriceFromDB = function(err, id=randomId, callback) {


  let db = new sqlite3.Database('data/fakePrices.sql', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the fakePrices file');
  });


  let queryString = `SELECT * FROM Prices WHERE rowId=${id}`;
  db.serialize(function() {
    db.get( queryString, function( err, result) {
      if (err) {
        console.log('this is the err', err);
      }
      console.log(`this is the result ${JSON.stringify(result)}`);
      callback(null, result);
    });
  });
};


module.exports = {
  getPriceFromDB: getPriceFromDB,
  byIdgetPriceFromDB: byIdgetPriceFromDB
};