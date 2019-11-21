const express = require("express");
const route = express.Router();

const secrets = require('../secret.js');
const dbURI = secrets.dbURI;
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection);

const authenticate = require('../modules/auth.js');

// endpoint - users POST -----------------------

route.post('/create', async function (req, res) {
    let updata = req.body;

    /// TODO Hashing
    //hashing the password before it is stored in the DB
    let hash = updata.password + 12345;

    try {
        let createdUser = await db.createuser(updata.name, hash, updata.email);
        if(await createdUser) {
            res.status(200).json({message: "User created successfully", user: createdUser});
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
            await res.status(200).json({message: "User obtained", user: user});
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


//TEMP ARRAY
const database = [];

route.post('/login', async function (req, res) {
    let reqinfo = req.body;
    let user = database.find(user => user.name === reqinfo.name);
    //let user = await db.getuser(reqinfo.name);

    if(user) {
        let pw = user.password;
        if (pw === reqinfo.password) {
            //create a token
            res.status(200).json({message:"you're logged in", token:check});
        }
        else {
            res.status(403).json({message:"not the right password"});
        }
    }
    else{
        res.status(400).json({message: "user does not exist"});
    }
    // test if user exists
    // test if password is correct


});



module.exports = route;