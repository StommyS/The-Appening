const pg = require("pg");
const db = function(dbConnectionString){

    const getUserByID = async function(userID){
        userData = null
        try {
             userData =  await runQuery('SELECT * from UserTbl where userID=$1',[userID])
        } catch (error) {
            // Deal with error??
        }
        return userData;
    }

    const createUser = async function(username, password){
        userData = null
        try {
            userData = await runQuery('INSERT username into ')
        }
    }

    return {
        getuser : getUserByID
    }
}

module.exports = db;