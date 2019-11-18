// endpoint - user UPDATE
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