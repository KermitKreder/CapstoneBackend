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

router.get('/GetUserInfo', async function(req, res, next)
{
    //TODO: Do we need anything else
    const user = req.body.username;
    
    //TODO: Make this list the user by their username
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.put('/EditUserInfo', async function(req, res, next)
{
    //TODO: Do we need anything else
    const user = req.body.username;
    
    //TODO: Make this edit the user info
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.delete('/DeleteUser', async function(req, res, next)
{
    //TODO: Do we need anything else
    const user = req.body.username;
    
    //TODO: Make this delete the user (mark a isDeleted flag)
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
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