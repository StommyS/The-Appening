const pg = require("pg");
const db = function(dbConnectionString){

    const getUserByID = async function(userID){
        userData = null
        try {
             userData =  await runQuery('SELECT * from user where userID=$1',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    }

    return {
        getuser : getUserByID
    }
}

module.exports = db;