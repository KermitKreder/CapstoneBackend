var express = require('express');
var mysql = require('mysql2');
var crypto = require('crypto');
var router = express.Router();

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

    let response = await QueryDatabase("SELECT * FROM Users WHERE username = '" + user + "';");

    if(response && response.length > 0)
    {
        if(response[0].u_password === hash)
        {
            var returnObject =
            {
                uid: response[0].uid,
                username: response[0].username,
                email: response[0].email,
                pfp: response[0].pfp
            };

            finalResponse[1] = returnObject;
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
    var hash = crypto.createHash('sha256').update("salt"+req.body.password+"pepper").digest('hex');
    const email = req.body.email;
    const pfp = req.body.pfp;

    //ERROR CODES:
    // 0 - success
    // 1 - blank field received
    // 2 - User with that username already exists
    // 3 - User with that email already exists
    // 4 - error during create user database query

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    if(user === "" || req.body.password === "" || email === "" || pfp === "")
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }

    let userExists = await QueryDatabase("SELECT * FROM Users WHERE username = '" + user + "';");
    
    if(userExists && userExists.length > 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let emailUsed = await QueryDatabase("SELECT * FROM Users WHERE email = '" + email + "';");

        if(emailUsed && emailUsed.length > 0)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 3;
            res.send(finalResponse).status(200).end();
        }
        else
        {
            let createUser = await QueryDatabase("INSERT INTO Users(username, u_password, email, pfp) VALUES('"+ user +"', '"+ hash +"', '"+ email +"', '" + pfp + "');");
            if(!createUser)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 4;
                res.send(finalResponse).status(200).end();
            }
            else
            {
                res.send(finalResponse).status(200).end();
            }
        }
    } 
});

//Delete a user
router.put('/DeleteUser', async function(req, res, next)
{
    const user = req.body.username;

    //ERROR CODES:
    // 0 - success
    // 1 - No user with that username exists
    // 2 - SQL update query error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let userExists = await QueryDatabase("SELECT * FROM Users WHERE username = '" + user + "';");

    if(userExists && userExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let makeUserInactive = await QueryDatabase("DELETE FROM Users WHERE username = '" + user + "';");

        if(!makeUserInactive)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
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

router.put('/UpdateUserPassword', async function(req, res, next)
{
    const user = req.body.username;
    var oldhash = crypto.createHash('sha256').update("salt"+req.body.oldPassword+"pepper").digest('hex');
    var newhash = crypto.createHash('sha256').update("salt"+req.body.newPassword+"pepper").digest('hex');

    //ERROR CODES:
    // 0 - success
    // 1 - No user with that username exists
    // 2 - SQL update query error
    // 3 - Wrong old password

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let userExists = await QueryDatabase("SELECT * FROM users WHERE username = '" + user + "';");

    if(userExists && userExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        if(userExists && userExists[0].password === oldhash)
        {
            let updateUserPassword = await QueryDatabase("UPDATE users SET password = '" + newhash + "' WHERE username = '" + user + "';");
    
            if(!updateUserPassword)
            {
                finalResponse[0].success = false;
                finalResponse[0].errorCode = 2;
                res.send(finalResponse).status(200).end();
            }
            else
            {
                finalResponse[0].success = true;
                finalResponse[0].errorCode = 0;
                res.send(finalResponse).status(200).end();
            }
        }
        else
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 3;
            res.send(finalResponse).status(200).end();
        }
    }
});

router.post('/ForgotUserPasswordSendEmail', async function(req, res, next)
{
    const username = req.body.username;
    const email = req.body.email; 

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        secure: true, // use SSL
        port: 465,
        auth: {
            user: 'milkmates@zohomail.com',
            pass: 'CapstoneEmail12'
        }
      });
    
      // Define the email options
      const mailOptions = {
        from: 'milkmates@zohomail.com',
        to: email,
        subject: 'Reset your password',
        text: `Hello ` + username + `, click the following link to reset your password: http://ec2-54-159-200-221.compute-1.amazonaws.com/`
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Email sent');
        }
      });
});

router.put('/ForgotUserPassword', async function(req, res, next)
{
    const user = req.body.username;
    var hash = crypto.createHash('sha256').update("salt"+req.body.newPassword+"pepper").digest('hex');

    //ERROR CODES:
    // 0 - success
    // 1 - No user with that username exists
    // 2 - SQL update query error

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let userExists = await QueryDatabase("SELECT * FROM Users WHERE username = '" + user + "';");

    if(userExists && userExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        let updateUserPassword = await QueryDatabase("UPDATE Users SET u_password = '" + hash + "' WHERE username = '" + user + "';");

        if(!updateUserPassword)
        {
            finalResponse[0].success = false;
            finalResponse[0].errorCode = 2;
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

router.get('/GetAllUsers', async function(req, res, next)
{
    let response = await QueryDatabase("SELECT * FROM Users;");
    res.send(response).status(200).end();
});

router.get('/GetUser', async function(req, res, next)
{
    const username = req.query.username;
    
    //ERROR CODES:
    // 0 - success
    // 1 - SQL SELECT error
    // 2 - No user with that username exists

    var finalResponse = 
    [
        {
            success: true,
            errorCode: 0
        }
    ]

    let userExists = await QueryDatabase("SELECT * FROM Users WHERE username = '" + username + "';");
    if(!userExists)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 1;
        res.send(finalResponse).status(200).end();
    }
    else if(userExists && userExists.length === 0)
    {
        finalResponse[0].success = false;
        finalResponse[0].errorCode = 2;
        res.send(finalResponse).status(200).end();
    }
    else
    {
        finalResponse[1] = userExists[0];
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