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

router.get('/GetAllChannels', async function(req, res, next)
{
    //TODO: Make this list all channels
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.get('/GetChannel', async function(req, res, next)
{
    const channelID = req.body.channelID;
    
    //TODO: Make this list a channel
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + channelID + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.post('/CreateChannel', async function(req, res, next)
{
    //TODO: Figure out if anything else is needed
    const username = req.body.username;
    
    //TODO: Make this create a channel
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + username + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.put('/EditChannel', async function(req, res, next)
{
    //TODO: Figure out if anything else is needed
    const channelID = req.body.channelID;
    
    //TODO: Make this edit a channel
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + channelID + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.delete('/DeleteChannel', async function(req, res, next)
{
    //TODO: Figure out if anything else is needed
    const channelID = req.body.channelID;
    
    //TODO: Make this delete a channel
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + channelID + "';");
    
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