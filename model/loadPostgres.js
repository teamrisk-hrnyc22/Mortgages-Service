var fs = require('fs');
var {Pool, Client} = require('pg');
var copyFrom = require('pg-copy-streams').from;

// const pool = new Pool({
//   user: 'testuser',
//   host: 'localhost',
//   database: 'mortgages',
//   password: 'password',
//   port: 5432,
// })

// pool.connect(function(err, client, done) {
//   if (err) {
//     console.log('There was an error connecting pool ot the PostgresSQL database : ', err);
//   }
//   var stream = client.query(copyFrom('COPY my_table FROM STDIN'));
//   var fileStream = fs.createReadStream('some_file.tsv')
//   fileStream.on('error', done);
//   stream.on('error', done);
//   stream.on('end', done);
//   fileStream.pipe(stream);
// });

// // pool.query('SELECT NOW()', (err, res) => {
// //   console.log(err, res)
// //   pool.end()
// // })

const client = new Client({
  user: 'testuser',
  host: 'localhost',
  database: 'mortgages',
  password: 'password',
  port: 5432,
})
client.connect()
.then(()=> {
  console.log('Client connected')
})
.catch((err) => {
  console.log('There was an issue connecting to the client: ', err);
})

console.time('Start loading');

client.query(`COPY mortgages FROM '/Users/Nyeh/Desktop/gitRepos/Mortgage-Service/model/mortgageData.csv' DELIMITER ',' CSV HEADER;
`, (err, res) => {
  if (err) {
    console.error('There was an error: ', err);
  } else {
    console.log('Connected to the postgres database! \n Here is the result: \n', res);
    console.timeEnd('Start loading');
  }
  client.end()
})




