const express = require("express");
const route = express.Router();


const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const secrets = require('../secret.js');
const hashtoken = process.env.TOKEN_SECRET || secrets.hashToken;

const dbConnection  = process.env.DATABASE_URL || secrets.dbURI;
const db = require("../modules/db")(dbConnection);

const authenticate = require('../modules/auth.js');

// endpoint - users POST -----------------------

route.post('/create', async function (req, res) {
    let updata = req.body;

    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHmac('sha256', salt);
    hash.update(updata.password);
    const hashedpw = hash.digest('hex');

    try {
        let createdUser = await db.createuser(updata.name, hashedpw, updata.email, salt);
        if(await createdUser) {
            res.status(200).json({message: "User created successfully", username: createdUser.username, email: createdUser.email});
        }
        else {
            res.status(500).json({message: "We couldn't create that user."});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

route.get('/', authenticate, async function(req,res) {

    let updata = req.body;
    let user = null;
    try {
        user = await db.getuser(updata.name);
        if(await user) {
            await res.status(200).json({message: "User obtained", username: user.username, email: user.email});
        }
        else {
            res.status(500).json({message: "We couldn't find that user."})
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

route.delete('/delete', authenticate, async function (req, res) {
   let updata = req.body;
   try {

       let deletedUser = await db.deleteuser(updata.name);
       await res.status(200).json({message: "User successfully deleted", username: deletedUser.name, email: deletedUser.email});
   }
   catch(err) {
       console.log(err);
       res.status(500).json({error: err});
   }
});

route.put('/update', authenticate, async function (req, res) {
    let updata = req.body;
    try {
        let newname = updata.newname;
        let updatedUser = await db.updateuser(newname, updata.name);
        if (await updatedUser) {
            res.status(200).json({message: "User successfully updated.", username: updatedUser.name, oldusername: updata.name, email:updatedUser.email});
        }
        else{
            res.status(500).json({message: "Database error"});

        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Database malfunction", error: err});
    }
});

route.post('/login', async function(req, res) {
   let updata = req.body;
   try {
       let dbuser = await db.getuser(updata.name);
       if(await dbuser) {
           const salt = dbuser.salt;
           const hash = crypto.createHmac('sha256', salt);
           hash.update(updata.password);
           const pwcompare = hash.digest('hex');

           if(pwcompare === dbuser.password) {
               let payload = { userid: dbuser.id };
               let tok = jwt.sign(payload, secrets.token, { expiresIn: "2h" }); //create token
               res.status(200).json({ email: dbuser.email, userid: dbuser.id, token: tok, username: dbuser.username});
           }
           else res.status(403).json({message: "wrong password"}).end();
       }
       else res.status(500).json({message: "database connection failed OR no such user"}).end();
   }
   catch(err) {
       console.log(err);
       res.status(500).json({message: "Something went wrong :c"}).end();
   }
});

route.delete('/wipe', authenticate, async function(req,res) {
    try {
        let deletion = await db.cleardb();
        if(await deletion) {
            res.status(200).json({message: "Users table cleared."});
        }
        else {
            res.status(500).json({message: "Could not clear users table."})
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

module.exports = route;