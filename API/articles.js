var express = require('express');
var mysql = require('mysql2');
var router = express.Router();

router.get('/GetArticle', async function(req, res, next)
{
    const articleID = req.body.articleID;
    
    //TODO: Make this list a specific article
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + articleID + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.get('/GetAllArticles', async function(req, res, next)
{
    //TODO: Make this list all articles
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + user + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.post('/AddArticle', async function(req, res, next)
{
    //TODO: figure out exactly what will be passed in
    const articleLink = req.body.articleLink;
    
    //TODO: Make this add a article
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + articleLink + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

router.delete('/DeleteArticle', async function(req, res, next)
{
    const articleID = req.body.articleID;
    
    //TODO: Make this delete a article
    let response = await QueryDatabase("SELECT * FROM test WHERE firstname = '" + articleID + "';");
    
    console.log(response);
    res.send(response).status(200).end();
});

async function QueryDatabase(sqlQuery)
{
    let connection = await ConnectToDatabase();
    connection.connect(function(err){
        
        if(!err) {
            console.log("Database is connected ... ");    
        } else {
            console.log("Error connecting database ... ");    
            console.log(err);
        }
    });

    return new Promise((resolve, reject) =>
    {
        connection.query(sqlQuery, function(err, results)
        {
            if (err) reject(err);
            console.log(results);
            resolve(results);
        });
        
        connection.end();
    })
}

async function ConnectToDatabase()
{
    var connection = mysql.createConnection({
        host     : 'capstone-database.chuvfybz3jvo.us-east-2.rds.amazonaws.com',
        port     : '3306',
        user     : 'admin',
        password : 'capstone1',
        database : 'capstone'
    });
    
    return connection;
}

module.exports = router;