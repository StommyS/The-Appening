const pg = require("pg");
const db = function(dbConnectionString){

    async function runQuery(query, params){
        const client = new pg.Client(dbConnectionString)
        await client.connect() // Did I connect? throw an error??
        const res = await client.query(query, params)
        let respons = res.rows; // Did we get anything?? Dont care. SEP
        await client.end()
        console.log("failed 7")
        return respons
    }

    const getUserByID = async function(userID){
        userData = null
        try {
            console.log("failed 5")
             userData =  await runQuery('SELECT * FROM users where userID=$1',[userID])
        } catch (error) {
            console.log("failed 6")
            // Deal with error??
        }
        return userData;
    }

    const createUser = async function(){
        userData = null
        try {
             userData =  await runQuery('INSERT INTO user (id, name, pwHash) VALUES(DEFAULT, $1, $2) RETURNING *',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    }

    return {
        createuser : createUser,
        getuser : getUserByID
    }
}


module.exports = db;