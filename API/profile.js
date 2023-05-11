var express = require('express');
var mysql = require('mysql2');
var crypto = require('crypto');
const e = require('express');
var router = express.Router();

router.post('/Follow', async function(req, res, next)
{
    const followerid = req.body.followerid;
    const followeeid = req.body.followeeid;

    //ERROR CODES:
    // 0 - success
    // 1 - SQL check already following error
    // 2 - Followerid is not a valid user id
    // 3 - followeeid is not a valid user id
    // 4 - Follower already follows followee
    // 5 - SQL insert follower/followee error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let followerExists = await QueryDatabase("SELECT * FROM Users WHERE uid = " + followerid + ";");
    if(!followerExists)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(followerExists && followerExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let followeeExists = await QueryDatabase("SELECT * FROM Users WHERE uid = " + followeeid + ";");
        if(!followeeExists)
        {
            inalResponse[0].success = false;
            finalResponse[0].errorCode = 1;
            res.send(finalResponse).status(200).end();
        }
        else if(followeeExists && followeeExists.length === 0)
        {
            inalResponse[0].success = false;
            finalResponse[0].errorCode = 3;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            let alreadyFollows = await QueryDatabase("SELECT * FROM Follow WHERE follower_id = " + followerid + " AND followee_id = " + followeeid + ";");
            if(!alreadyFollows)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 1;
                res.send(finalResponse).status(200).end();
            }
            else if(alreadyFollows && alreadyFollows.length > 0)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 4;
                res.send(finalResponse).status(200).end();
            }
            else
            {
                let nowFollows = await QueryDatabase("INSERT INTO Follow(follower_id, followee_id) VALUES (" + followerid + ", " + followeeid + ");");
                if(!nowFollows)
                {
                    finalResponse[0].success = false;
                    finalResponse[0].errorCode = 5;
                    res.send(finalResponse).status(200).end();
                }
                else
                {
                    finalResponse[0].success = true;
                    finalResponse[0].errorCode = 0;
                    res.send(finalResponse).status(200).end();
                }
            }
        }
    }
});

router.post('/Unfollow', async function(req, res, next)
{
    const followerid = req.body.followerid;
    const followeeid = req.body.followeeid;

    //ERROR CODES:
    // 0 - success
    // 1 - SQL Select error
    // 2 - Follower already doesnt follow followee
    // 3 - SQL Delete error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let followerRelationshipExists = await QueryDatabase("SELECT * FROM Follow WHERE follower_id = " + followerid + " AND followee_id = " + followeeid + ";");
    
    if(!followerRelationshipExists)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(followerRelationshipExists && followerRelationshipExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let deleteFollowRelationship = await QueryDatabase("DELETE FROM Follow WHERE follower_id = " + followerid + " AND followee_id = " + followeeid + ";");

        if(!deleteFollowRelationship)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 3;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            finalResponse[0].success = true;
            finalResponse[0].errorCode = 0;
            res.send(finalResponse).status(200).end();
        }
    }
});

router.get('/GetFollowers', async function(req, res, next)
{
    const uid = req.query.uid;

    //ERROR CODES:
    // 0 - success
    // 1 - SQL select error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let getFollowerCount = await QueryDatabase("SELECT * FROM Follow WHERE followee_id = " + uid + ";");
    
    if(!getFollowerCount)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[1] = 
        {
            followerCount: getFollowerCount.length.toString()
        }

        var i = 0;
        var arrayOfFollowers = [];
        for(followers of getFollowerCount)
        {
            var usernameOfFollower = await QueryDatabase("SELECT * FROM Users WHERE uid = " + followers.follower_id + ";");
            arrayOfFollowers[i] = {
                username: usernameOfFollower[0].username
            }
            i += 1;
        }

        finalResponse[2] = arrayOfFollowers;

        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.get('/GetFollowing', async function(req, res, next)
{
    const uid = req.query.uid;

    //ERROR CODES:
    // 0 - success
    // 1 - SQL select error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let getFollowingCount = await QueryDatabase("SELECT * FROM Follow WHERE follower_id = " + uid + ";");
    
    if(!getFollowingCount)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[1] = 
        {
            followerCount: getFollowingCount.length.toString()
        }
        
        var i = 0;
        var arrayOfFollowing = [];
        for(followees of getFollowingCount)
        {
            var usernameOfFollowee = await QueryDatabase("SELECT * FROM Users WHERE uid = " + followees.followee_id + ";");
            arrayOfFollowing[i] = {
                username: usernameOfFollowee[0].username
            }
            i += 1;
        }

        finalResponse[2] = arrayOfFollowing;
        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
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