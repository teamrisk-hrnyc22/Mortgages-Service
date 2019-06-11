const fs = require('fs');
const faker = require('faker');

//======= Fast CSV Module Related Functions ====================//
const csv = require('fast-csv');
const csvStream = csv.createWriteStream({headers: true});
const writableStream = fs.createWriteStream('mortgageData.csv');
//==============================================================//
console.time('Timer');
writableStream.on('finish', () => {
    console.log('Done!');
    console.timeEnd('Timer');
})

csvStream.pipe(writableStream);

for (let i = 1; i < 10000000; i++) {

    let randomNumberToInsert = (faker.random.number({
        'min': 634000,
        'max': 1700000
    }));

    csvStream.write({id: i, price: randomNumberToInsert});
}

csvStream.end();



//==========================



  
