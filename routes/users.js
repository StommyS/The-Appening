const express = require("express");
const route = express.Router();

const crypto = require("crypto");

const secrets = require('../secret.js');
const hashtoken = process.env.TOKEN_SECRET || secrets.hashToken;
const dbURI = secrets.dbURI;
const dbConnection  = process.env.DATABASE_URL || dbURI;
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

route.get('/', async function(req,res) {
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

route.delete('/delete', async function (req, res) {
   let updata = req.body;
   try {
       let deletedUser = await db.deleteuser(updata.name);
       await res.status(200).json({message: "User successfully deleted", user: deletedUser});
   }
   catch(err) {
       console.log(err);
       res.status(500).json({error: err});
   }
});

route.put('/update', async function (req, res) {
    let updata = req.body;
    try {
        let newname = updata.newname;
        let updatedUser = await db.updateuser(newname, updata.name);
        if (await updatedUser) {
            res.status(200).json({message: "User successfully updated.", user: updatedUser});
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
               res.status(200).json({message: "logged in and all ok"});
           }
           else res.status(403).json({message: "wrong password"});
       }
       else res.status(403).json({message: "no such user I guess"});
   }
   catch(err) {
       console.log(err);
       res.status(500).json({message: "Something went wrong :c"}).end();
   }
});

route.delete('/wipe', async function(req,res) {
    try {
        let deletion = await db.deleteall();
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