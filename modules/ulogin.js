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