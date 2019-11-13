// endpoint - user CREATE
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