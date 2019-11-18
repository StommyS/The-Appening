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