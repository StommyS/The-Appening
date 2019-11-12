const express = require("express")
const route = express.Router();
const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection)

// endpoint - users POST -----------------------
route.post('/', async function (req, res, next) {
    console.log("begynnelsen av post")
    let updata = req.body; //the data sent from the client

    let sql = 'INSERT INTO user (id, name, pwHash) VALUES(DEFAULT, $1, $2) RETURNING *';
    let values = [updata.user, updata.pw];

    try {
        let result = await pool.query(sql, values);
        if (result.rows.length > 0) {
            res.status(200).json({ msg: "Insert OK" });
        }
        else {
            throw "Insert failed";
        }

    }
    catch (err) {
        console.log("error at catch")
        res.status(500).json({ error: err });
    }
});

route.get('/:userID', async function(req,res){
    let user = await db.getuser(req.params.userID);
    res.status(200).json(user)
})



module.exports = route;