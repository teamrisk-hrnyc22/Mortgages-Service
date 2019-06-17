'use strict';
// const {pool} = require('./postgres.js');
var faker = require('faker');



/*------------------------------------------------------*/

// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;


// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   //Check if work id is died
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });

// } else {
//   // This is Workers can share any TCP connection
//   // It will be initialized using express
//   console.log(`Worker ${process.pid} started`);

// let worker = cluster.worker.id;
// console.log(`Running on worker with id ==> ${worker}`);
// }

/*------------------------------------------------------*/

// const fastcsv = require('fast-csv');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;






const csvWriter = createCsvWriter({
	path: 'mortgageData.csv',
	header: [
		{id: 'id', title: 'id'},
		{id: 'price', title: 'price'}
	]
})

let reviewId = 1;
//
let recSeeder = () => {
  let recSeeds = [];
  while (recSeeds.length < 1000) {
    recSeeds.push({
			id: reviewId,
			price: faker.random.number({
				'min': 10,
				'max': 100
			}),
			
		});
	reviewId++;
  }
  return recSeeds;
};
// [{},{},{},...]

let batches = 0;
let append = () => {
  if (batches < 10000) {
    batches += 1;
    let data = recSeeder();
    csvWriter.writeRecords(data).then(() => append());
  } else {
    console.timeEnd('writeCSV');
    console.log('The CSV file was written successfully');
  }
};

console.time('writeCSV');
append();

/*------------------------------------------------------*/

// fastcsv  
//   .write(tempArray, { headers: true })
//   .pipe(ws);

// (beginCommit = async () => {
// 	const client = await pool.connect();
// 	const host = "Jim"
// 	const message = "i dont workout"
// 	try {
// 		await client.query('BEGIN')

// 		for (let i = 0; i < 1000; i++) {
// 			await client.query(`insert into messages
// 			(toHost, messageBody) values ($1, $2)`, [host, message])
// 		}

// 		await client.query('COMMIT')
// 	} catch (e) {
// 		await client.query('ROLLBACK')
// 		throw e
// 	} finally {
// 		client.release()
// 	}
// })

// (repeat = async () => {
// 	console.time('timer')
// 	for (let i = 0; i < 10; i++) {
// 		await beginCommit();
// 	}
// 	await console.timeEnd('timer')
// })
// repeat()

/*------------------------------------------------------*/

// async function add (host, message) {                                                                                                     
// 	for (let i = 0; i < 1000; i++) {
// 		await pool.query(`insert into messages
// 			(toHost, messageBody) values ($1, $2)`, [host, message], (err) => {
	
// 			if (err) {
// 				console.error(err, ' <-- Error occured on sending a message to host, check post /contact/:host/message in server/index.js line 45');
// 			} 
			
// 			else console.log('works! ', i);
// 		})
// 	}
// }

// async function action () {
// 	console.time('timer');
// 	for (let i = 0; i < 10; i++) {
// 		add('Tom', 'my message');
// 	}
// 	console.timeEnd('timer');
// }

// action();