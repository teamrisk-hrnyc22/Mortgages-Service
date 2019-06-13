var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('../model/queryDB.js');
var path = require('path');
var cors = require('cors');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(cors());


const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'mortgages',
  password: 'password',
  port: 5432,
})

pool.connect()
.then(()=> {
  console.log('pool connected')
})
.catch((err) => {
  console.log('There was an issue connecting to the pool: ', err);
})




app.get('/:number', function(req, res) {
    // console.log('getting here');
    
    // console.log('__dirname: ', __dirname);
    // res.locals.id = req.params.number;
    // console.log(res.locals.id);
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// if the client requests queries just api it will query the database for some reason
app.get('/api/price', function(req, res) {
    // db.getPriceFromDB(null, function(result) {
    //     console.log('/price this is the result from the server', result);
    //     res.send(result);
    // }); 

    res.send({
        "price": 100000
    })
});

var queryByIdFromPostgresDB = function(err, id, callback) {
    if (err) {
        console.log(`There was an error connecting to the database`)
    }
    let queryString = `SELECT * FROM mortgages WHERE id = ${id}`;
    pool.query(queryString, (err, res) => {
        if (err) {
            console.log(`There was an issue querying the data at id ${id} :`, err);
        } else {
            console.log(`Retrieval of data for id ${id} was successful! Here's the result: ${res}`);
            callback(err, res);
        }
    })
}

app.get('/api/price/:priceId', function(req, res) {
    // db.byIdgetPriceFromDB(null, req.params.priceId, function(result){ 
    //     console.log('/price/:priceId this is the result from the server', result);
    //     res.locals.id = req.params.priceId;
    //     console.log('res.locals.id: ', res.locals.id);
        
    //     res.send(result);
    // });
    // queryByIdFromPostgresDB(null, req.params.priceId, function(err, data) {
    //     if (err) {
    //         console.log(`There was an error retrieving data :`, err)
    //     } else {
    //         console.log(`Here's the data we got: `, data) 
    //         res.send(data);
    //     }
    // })
    let queryId = req.params.priceId;
    let queryString = `SELECT price FROM mortgages WHERE id = ${queryId}`;
    pool.query(queryString)
      .then((data) => {
          console.log('This is the data from the pool query: ', data.rows[0].price);
          res.send(data.rows[0]);
      })
      .catch((err) => {
          console.error('There was an error querying from pool.query: ', err);
        //   res.sendStatus(404);
      })
    
});


var port = process.env.PORT || 3008;

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});