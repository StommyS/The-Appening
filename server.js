const pg = require("pg");
const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const connstring  = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({ connectionString: connstring });

const cors = require('cors');
const express = require('express');
const app = express(); //server-app

// middleware ------------------------------------
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body


// endpoint - users POST -----------------------
app.post('/users', async function (req, res) {

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
        res.status(500).json({ error: err });
    }
});

// start server -----------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port 3000!');
});
