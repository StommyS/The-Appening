const pg = require("pg");
const db = function(dbConnectionString){

    async function runQuery(query, params){
        const client = new pg.Client(dbConnectionString)
        await client.connect() // Did I connect? throw an error??
        const res = await client.query(query, params)
        let respons = res.rows; // Did we get anything?? Dont care. SEP
        await client.end()
        return respons
    }

    const getUserByID = async function(userID){
        userData = null
        try {
             userData =  await runQuery('SELECT * FROM users where userID=$1',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    }

    const createUser = async function(req, res){
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
    }

    return {
        createuser : createUser,
        getuser : getUserByID
    }
}


module.exports = db;