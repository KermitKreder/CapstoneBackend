var express = require('express');
var mysql = require('mysql2');
var router = express.Router();

var connection = mysql.createConnection({
    host     : 'ec2-3-218-141-255.compute-1.amazonaws.com',
    port     : '3306',
    user     : '',
    password : '',
    database : ''
});

connection.connect(function(err){
    
    if(!err) {
        console.log("Database is connected ... ");    
    } else {
        console.log("Error connecting database ... ");    
        console.log(err);
    }
});

router.get('/GetAllTransactionsByUser', async function(req, res, next)
{
    const user = req.body.username;
    
    //TODO: Make this list all transactions by User
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.get('/GetTransaction', async function(req, res, next)
{
    const transactionID = req.body.transactionID;
    
    //TODO: Make this list all transactions by Zip code
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + transactionID + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.post('/CreateTransaction', async function(req, res, next)
{
    //TODO: Figure out if anything else is needed
    const stockTicker = req.body.stockTicker;
    
    //TODO: Make this create a transactions
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + stockTicker + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

async function QueryDatabase(sqlQuery)
{
    return new Promise((resolve, reject) =>
    {
        connection.query(sqlQuery, function(err, results)
        {
            if (err) reject(err);
            console.log(results);
            resolve(results);
        });

    })
}

module.exports = router;