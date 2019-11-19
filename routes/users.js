const check = require('../modules/token.js');

const pg = require("pg");
const express = require("express");
const route = express.Router();
const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection);
const pool = new pg.Pool({ connectionString: dbConnection });

const authenticate = require('../modules/auth.js');

// endpoint - users POST -----------------------

route.post('/create', async function (req, res) {

    let updata = req.body; //the data sent from the client

    //hashing the password before it is stored in the DB
    let hash = 12345;

    try {
        console.log("yello");
        db.createuser(updata.name,hash);
        //createuser(updata.name,hash);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err }); //send error response
    }
});

route.get('/:userID', async function(req,res){
    let user = await db.getuser(req.params.userID);
    res.status(200).json(user)
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

// does not work but I have no clue why
route.get('/data', function (req, res) {
    console.log(req.header);
    res.status(500).json({message: "here is your data"});
});



module.exports = route;