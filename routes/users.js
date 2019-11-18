const express = require("express")
const route = express.Router();
const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection)

// endpoint - users POST -----------------------
route.post('/user', async function (req, res, next) {
    let user = db.createuser()
});

route.get('/:userID', async function(req,res){
    let user = await db.getuser(req.params.userID);
    res.status(200).json(user)
})



module.exports = route;