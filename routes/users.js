const express = require("express")
const route = express.Router();
const db = require("../modules/db")(process.env.dbconnection)

const user = function(){


// endpoint - users POST -----------------------
route.post('/', async function (req, res) {

    let updata = req.body; //the data sent from the client

    let sql = 'INSERT INTO user (id, name, pwHash) VALUES(DEFAULT, $1, $2) RETURNING *';
    let values = [updata.user, updata.pw];

    try {
        console.log("error at try")
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({ msg: "Insert OK" });
        }
        else {
            console.log("error at else")
            throw "Insert failed";
        }

    }
    catch (err) {
        console.log("error at catch")
        res.status(500).json({ error: err });
    }
});

/*
route.get('/', async function(req, res){
    let user = db.getuser(req.body.userID)
    if(user){
        console.log("failed 3")
        res.status(200).json(user)
    } else{
        console.log("failed 4")
        throw "There is no user with that userID"
    }
});
*/

};

module.exports = user;