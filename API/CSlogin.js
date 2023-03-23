var express = require('express');
var mysql = require('mysql2');
var crypto = require('crypto');
var router = express.Router();

var connection = mysql.createConnection({
    host     : 'capstone-database.chuvfybz3jvo.us-east-2.rds.amazonaws.com',
    port     : '3306',
    user     : 'root',
    password : 'capstone1',
    database : 'test'
});

connection.connect(function(err){
    
    if(!err) {
        console.log("Database is connected ... ");    
    } else {
        console.log("Error connecting database ... ");    
        console.log(err);
    }
});

//Check for a user
router.post('/CheckForUser', async function(req, res, next) 
{
    const user = req.body.username;
    var hash = crypto.createHash('sha256').update("salt"+req.body.password+"pepper").digest('hex');

    //ERROR CODES:
    // 0 - success
    // 1 - username not found
    // 2 - incorrect password
    // 3 - blank username received
    // 4 - blank password received
    // 5 - inactive account

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]
    
    if(user === "")
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 3;
        res.send(finalResponse).status(200).end();
    }

    if(req.body.password === "")
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 4;
        res.send(finalResponse).status(200).end();
    }

    let response = await QueryDatabase("SELECT * FROM users WHERE username = '" + user + "';");

    if(response && response.length > 0)
    {
        if(response[0].password === hash)
        {
            finalResponse[1] = response;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
            res.send(finalResponse).status(200).end();
        }
    }
    else
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
});

// Register a user
router.post('/RegisterUser', async function(req, res, next) 
{
    const user = req.body.username;
    const pass = req.body.password;
    const pfpPath = req.body.pfp;
    const tags = req.body.tags;

    var hash = crypto.createHash('sha256').update("salt"+pass+"pepper").digest('hex');

    //ERROR CODES:
    // 0 - success
    // 1 - blank field received
    // 2 - User with that username already exists
    // 3 - error during create user database query

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    if(user === "" || req.body.password === "" || pfpPath === "" || tags === "")
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }

    //TODO: Make a create and not find
    let userExists = await QueryDatabase("SELECT * FROM users WHERE username = '" + user + "';");
    
    if(userExists)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }

    let createUser = awaitQueryDatabase("INSERT INTO users(username, password, pfp, tags) VALUES('"+ user +"', '"+ hash +"', '"+ pfpPath +"', '"+ tags +"')");
    
    if(!createUser)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 3;
        res.send(finalResponse).status(200).end();
    }

    res.send(finalResponse).status(200).end();
});

//Delete a user
router.delete('/DeleteUser', async function(req, res, next)
{
    const user = req.body.username;
    const pass = req.body.passwordHash;

    //TODO: Make a delete and not find
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.delete('/DeleteUser', async function(req, res, next)
{
    const user = req.body.username;
    const pass = req.body.passwordHash;
    
    //TODO: Make a update and not find
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.put('/UpdateUserPassword', async function(req, res, next)
{
    const user = req.body.username;
    const pass = req.body.passwordHash;
    
    //TODO: Make a update and not find
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.get('/IsUserAuthenticated', async function(req, res, next)
{
    const user = req.body.username;
    const authToken = req.body.authenticationToken;
    
    //TODO: Make this find auth token not user
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