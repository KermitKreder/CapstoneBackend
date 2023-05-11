var express = require('express');
var mysql = require('mysql2');
var router = express.Router();

router.get('/GetAllPostsByUser', async function(req, res, next)
{
    const uid = req.query.uid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - SQL select posts error
    // 2 - No posts with that uid found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let pids = await QueryDatabase("SELECT * FROM Post WHERE creator_id = " + uid + ";");
    if(!pids)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(pids && pids.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        var i = 1;

        for( pid of pids)
        {
            var post = 
            {
                pid: pid.pid,
                creator_id: pid.creator_id,
                image: pid.image,
                title: pid.title,
                content: pid.content,
                created_at: pid.created_at,
                likes: pid.likes,
            }
            
            finalResponse[i] = post;
            i += 1;
        }

        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.get('/GetPost', async function(req, res, next)
{
    const pid = req.query.pid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - SQL select post error
    // 2 - No post with that pid found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let post = await QueryDatabase("SELECT * FROM Post WHERE pid = " + pid + ";");
    if(!post)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(post && post.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[1] = post;
        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.get('/GetAllPosts', async function(req, res, next)
{
    //ERROR CODES:
    // 0 - success
    // 1 - SQL select post error
    // 2 - No post with that pid found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let post = await QueryDatabase("SELECT * FROM Post;");
    if(!post)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(post && post.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[1] = post;
        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.get('/QueryPosts', async function(req, res, next)
{
    const tag = req.query.tag;
    const filter = req.query.filter;
    const limit = parseInt(req.query.limit);
    //ERROR CODES:
    // 0 - success
    // 1 - Filter received is not a valid filter
    // 2 - Limit is not a positive integer
    // 3 - SQL select error
    // 4 - No post with that tag found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    if(filter !== "created_at" && filter !== "likes")
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        if(!isNaN(limit) && Number.isInteger(limit) && limit > 0)
        {
            let post = await QueryDatabase("SELECT * FROM Post WHERE tags LIKE '%" + tag + "%' ORDER BY " + filter + " DESC LIMIT " + limit + ";");
            if(!post)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 3;
                res.send(finalResponse).status(200).end();
            }
            else if(post && post.length === 0)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 4;
                res.send(finalResponse).status(200).end();
            }
            else
            {
                finalResponse[1] = post;
                finalResponse[0].success = true;
                finalResponse[0].errorCode = 0;
                res.send(finalResponse).status(200).end();
            }
        }
        else
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
            res.send(finalResponse).status(200).end();
        }
    }

});

router.post('/CreatePost', async function(req, res, next)
{
    const uid = req.body.uid;
    const image = req.body.image;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    
    //ERROR CODES:
    // 0 - success
    // 1 - SQL insert post error
    // 2 - SQL select post error
    // 3 - No post with that caption found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let response = await QueryDatabase("INSERT INTO Post (creator_id, image, title, content, tags) VALUES(" + uid + ", '" + image + "', '" + title + "', '" + content + "', '" + tags + "');");
    if(!response)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let post = await QueryDatabase("SELECT * from Post WHERE creator_id = '" + uid + "' ORDER BY pid DESC;");
        if(!post)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
            res.send(finalResponse).status(200).end();
        }
        else if(post && post.length === 0)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 3;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            finalResponse[1] = post;
            finalResponse[0].success = true;
            finalResponse[0].errorCode = 0;
            res.send(finalResponse).status(200).end();
        }
    }
});

router.put('/DeletePost', async function(req, res, next)
{
    const pid = req.body.pid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - SQL select post error
    // 2 - No post with that pid found
    // 3 - SQL delete post error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let post = await QueryDatabase("SELECT * FROM Post WHERE pid = " + pid + ";");
    if(!post)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(post && post.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let deletePost = await QueryDatabase("DELETE FROM Post WHERE pid = " + pid + ";");
        if(!deletePost)
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

router.put('/DeletePostBatch', async function(req, res, next)
{
    const pids = req.body.pids;
    
    //ERROR CODES:
    // 0 - success
    // 1 - No posts with any pids found
    // 2 - SQL delete post error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    const pidArray = pids.split(",");
    const finalPidArray = [];
    var i = 0;

    for(pid of pidArray)
    {
        let post = await QueryDatabase("SELECT * FROM Post WHERE pid = " + pid + ";");
        if(!post)
        {

        }
        else if(post && post.length === 0)
        {

        }
        else
        {
            finalPidArray[i] = pid;
            i += 1;
        }
    }

    if(finalPidArray.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        for(pid of finalPidArray)
        {
            let deletePost = await QueryDatabase("DELETE FROM Post WHERE pid = " + pid + ";");
        }

        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.get('/GetPostComments', async function(req, res, next)
{
    const pid = req.query.pid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - No posts with this pid found
    // 2 - no comments on this post

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let post = await QueryDatabase("SELECT * FROM Post WHERE pid = " + pid + ";");
    if(!post)
    {

    }
    else if(post && post.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let comments = await QueryDatabase("SELECT * FROM Comments WHERE post_id = " + pid + ";");
        if(!comments)
        {

        }
        else if(comments && comments.length === 0)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            finalResponse[1] = comments;
            finalResponse[0].success = true;
            finalResponse[0].errorCode = 0;
            res.send(finalResponse).status(200).end();
        }
    }
});

router.post('/CreatePostComments', async function(req, res, next)
{
    const pid = req.body.pid;
    const commentor_id = req.body.commentor_id;
    const content = req.body.content;
    
    //ERROR CODES:
    // 0 - success
    // 1 - No posts with this pid found

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let post = await QueryDatabase("SELECT * FROM Post WHERE pid = " + pid + ";");
    if(!post)
    {

    }
    else if(post && post.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let addComment = await QueryDatabase("INSERT INTO Comments (commentor_id, post_id, content) VALUES ('" + commentor_id + "', " + pid + ", '" + content + "');");
        if(!addComment)
        {

        }
        else
        {
            finalResponse[0].success = true;
            finalResponse[0].errorCode = 0;
            res.send(finalResponse).status(200).end();
        }
    }
});

router.put('/DeletePostComment', async function(req, res, next)
{
    const comment_id = req.body.comment_id;
    
    //ERROR CODES:
    // 0 - success
    // 1 - Delete comment error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let deleteComment = await QueryDatabase("DELETE FROM Comments WHERE comment_id = " + comment_id + ";");
    if(!deleteComment)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.post('/LikePost', async function(req, res, next)
{
    const pid = req.body.pid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - Add like error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let addLike = await QueryDatabase("UPDATE Post SET likes = likes + 1 WHERE pid = " + pid + ";");
    if(!addLike)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[0].success = true;
        finalResponse[0].errorCode = 0;
        res.send(finalResponse).status(200).end();
    }
});

router.post('/UnlikePost', async function(req, res, next)
{
    const pid = req.body.pid;
    
    //ERROR CODES:
    // 0 - success
    // 1 - Add like error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let addLike = await QueryDatabase("UPDATE Post SET likes = likes - 1 WHERE pid = " + pid + ";");
    if(!addLike)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
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