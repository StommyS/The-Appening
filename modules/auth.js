const check = require('./token.js');

const authenticate = function (req, res, next) {
    let token = req.headers['authorization'];

    console.log("authenticating");
    if(token) {
        //verify it
        if(token === check.secret) {
            console.log("someone logged in successfully!");
            next();
        }
        else {
            res.status(403).end() // token expired or incorrect
        }
    }
    else {
        res.status(403).json({message: "token not found"}).end(); // no token, forbidden
    }
    // checks the token right
};


const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("./db")(dbConnection);

const auth = async function(req, res, next) {
  // require database
    let reqinfo = req.body;
    let user = await db.getuser(reqinfo.name);

    if(user) {
        let pw = user.password;
        if (pw === reqinfo.password) {
            next();
        }
        else {
            res.status(403).json({message:"not the right password"}).end();
        }
    }
    else{
        res.status(400).json({message: "user does not exist"}).end();
    }
};

module.exports = authenticate;