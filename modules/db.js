const pg = require("pg");

const db = function(dconnectionString) {
    const pool = new pg.Pool({ connectionString: dconnectionString });

    async function runQuery(query, params){
        const res = await pool.query(query, params);
        let response = res.rows; // Did we get anything?? Dont care. SEP
        return response;
    }

    const createUser = async function(name,pwhash, email, salt){
        let userData = null;
        try {
            userData =  await runQuery('INSERT INTO "user" (id, "username", "password", "email", "salt") VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *',[name, pwhash, email, salt]);
            console.log("creating user");
            return await userData[0];
        } catch (error) {
            // expected failure points: user already exists, no data sent, no database available.
            console.log(salt);
            console.log("failed");
            console.log(error);
            return userData;
        }
    };

    const getUser = async function(name) {
        let userData = null;
        try {
            userData =  await runQuery('SELECT * FROM public."user" WHERE "username" = $1', [name]);
            return await userData[0];
        } catch (error) {
            // expected failure points: no such user, no data sent, no database
            console.log(error);
            return userData;
        }
    };

    const deleteUser = async function(name) {
        let userData = null;
        try {
            userData =  await runQuery('DELETE FROM public."user" WHERE "username" = $1 RETURNING *',[name]);
            return await userData[0];
        } catch (error) {
            // expected failure points: no such user, no data sent, no database
            console.log(error);
            return userData;
        }
    };

    const updateUser = async function(newname, oldname) {
        let userData = null;

        try {
            userData = await getUser(oldname);

            if(userData) {
                let id = userData[0].id;

                let updated =  await runQuery('UPDATE public."user" SET username = $1 WHERE id = $2 RETURNING *', [newname,id]);
                return await updated[0];
            }

        }catch (error) {
            console.log("is this the failing one?");
            console.log(error);
            return userData;
        }
    };

    const clearDB = async function() {
        try {
            await runQuery('DELETE FROM "user" RETURNING *');
            return await true;
        } catch (error) {
            console.log("major error!");
            console.log(error);
            return false;
        }
    };


    return {
        createuser : createUser,
        deleteuser : deleteUser,
        deleteall : clearDB,
        getuser : getUser,
        updateuser : updateUser
    }
};

module.exports = db;