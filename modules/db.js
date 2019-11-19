const pg = require("pg");

const db = function(dconnectionString) {
    const pool = new pg.Pool({ connectionString: dconnectionString });

    async function runQuery(query, params){
        await pool.connect(); // Did I connect? throw an error??
        const res = await pool.query(query, params);
        let response = res.rows; // Did we get anything?? Dont care. SEP
        await pool.end();
        return response
    }

    const createUser = async function(name,pwhash){
        let userData = null;
        console.log("starting create user");

        try {
            userData =  await runQuery('INSERT INTO "user" (id, "user", "pwHash") VALUES(DEFAULT, $1, $2) RETURNING *',[name,pwhash]);
            console.log(userData);
        } catch (error) {
            console.log("major error!");
            console.log(error);
            // Deal with error??
        }
        return userData;
    };

    return {
        createuser : createUser,
        //getuser : getUserByID
    }
};

module.exports = db;

/*const pg = require("pg");
const db = function(dbConnectionString){

    async function runQuery(query, params){
        const client = new pg.Client(dbConnectionString);
        await client.connect(); // Did I connect? throw an error??
        const res = await client.query(query, params);
        let respons = res.rows; // Did we get anything?? Dont care. SEP
        await client.end();
        return respons
    }

    const getUserByID = async function(userID){
        userData = null;
        try {
             userData =  await runQuery('SELECT * FROM users where userID=$1',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    };

    const createUser = async function(){
        userData = null;
        try {
             userData =  await runQuery('INSERT INTO user (id, name, pwHash) VALUES(DEFAULT, $1, $2) RETURNING *',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    };

    return {
        createuser : createUser,
        getuser : getUserByID
    }
};


module.exports = db;*/