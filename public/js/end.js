// endpoint - user POST
app.post('/user', async function (req, res) {

    let updata = req.body;


    let sql = 'INSERT INTO user (id, name, pwHash) VALUES(DEFAULT, $1, $2) RETURNING *';
    let values = [updata.user, updata.pw];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({ msg: "Creation OK" });
        }
        else {
            throw "GO AWAY!!";
        }

    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// endpoint - user DELETE
app.delete('/user', async function (req, res) {

    let updata = req.body; 


    let sql = 'DELETE FROM user WHERE id = $1 RETURNING *';
    let values = [updata.id];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({ msg: "Deletion complete" });
        }
        else {
            throw "Deletion failed";
        }

    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// endpoint - user Update
app.post('/user', async function (req, res) {

    let updata = req.body; 


    let sql = 'UPDATE user SET name = $2, pwHash = $3 WHERE id = $1 RETURNING *';
    let values = [updata.id, updata.user, updata.pw];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({ msg: "Update complete" });
        }
        else {
            throw "Update failed";
        }

    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});

// endpoint - user Login
app.post('/user', async function (req, res) {

    let updata = req.body; 


    let sql = 'SELECT * FROM user WHERE user = $1';
    let values = [updata.user, updata.pw];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length == 0) {
            res.status(400).json({ msg: "User doesn't exists" });
        }

    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});