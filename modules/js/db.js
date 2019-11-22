const pg = require("pg");

const db = function(dconnectionString) {
    const pool = new pg.Pool({ connectionString: dconnectionString });

    async function runQuery(query, params){
        await pool.connect(); // Did I connect? throw an error??
        const res = await pool.query(query, params);
        let response = res.rows; // Did we get anything?? Dont care. SEP
        return response
    }

    const createUser = async function(name,pwhash, email) {
        let userData = null;
        try {
            userData =  await runQuery('INSERT INTO "user" (id, "username", "password", "email") VALUES(DEFAULT, $1, $2, $3) RETURNING *',[name,pwhash, email]);
            return await userData;
        } catch (error) {
            // expected failure points: user already exists, no data sent, no database available.
            return userData;
        }
    };

    /*const deleteUser = async function(id) {
        let userData = null;

        try {
            userData = await runQuery('DELETE * FROM "user" WHERE id = $1',[id]);
            return await userData;
        } catch (error) {
            //failure: no connection?
        }
    };*/

    const getUser = async function(name) {
        let userData = null;
        try {
            userData =  await runQuery('SELECT * FROM public."user" WHERE "user" = $1', [name]);
            return await userData;
        } catch (error) {
            // expected failure points: no such user, no data sent, no database
            console.log(error);
            return userData;
        }
    };

    const deleteUser = async function(name) {
        let userData = null;
        try {
            userData =  await runQuery('DELETE FROM public."username" WHERE "user" = $1 RETURNING *',[name]);
            return await userData;
        } catch (error) {
            // expected failure points: no such user, no data sent, no database
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

    const updateUser = async function(id, name, pwhash, email) {
        let userData = null;
        
        try {
            userData = await runQuery('UPDATE "user" SET "username" = $2, "password" = $3, "email" = $4 WHERE id = $1 RETURNING *',[id, name, pwhash, email]);
            return await userData;
        } catch (error) {
            //deal with error.... done?
            return userData;
        }
    };

    const userLogin = async function() {
        //some code

        try {
            userData = await runQuery('',[]);
        } catch (error) {
            //deal with error
        }
    };

    const createPresentation = async function(slide) {
        let presentationData = null;

        try {
            presentationData = runQuery('INSERT INTO "presentation" (pId, "slide") VALUES(DEFAULT, $1) RETURNING *',[slide]);
            return await presentationData;
        } catch (error) {
            //we about to find out
            return await presentationData;
        }
    };

    const getPresentation = async function(slide) {
        let presentationData = null;

        try {
            presentationData =  await runQuery('SELECT * FROM "presentation" WHERE "vet faktisk ikke" = $1', [slide]);
            return await presentationData;
        } catch (error) {
            // expected failure points: no connection, no such user
            return presentationData;
        }
    };

    const deletePresentation = async function(pId) {
        let presentationData = null;

        try {
            presentationData = runQuery('DELETE * FROM "presentation" WHERE pId = $1',[pId]);
            return await presentationData;
        } catch (error) {
            //dealth with error
            return await presentationData;
        }
    };

    const updatePresentation = async function(pId, slide) {
        let presentationData = null;

        try {
            presentationData = runQuery('UPDATE "presentation" SET "slide" = $2 WHERE id = $1 RETURNING *',[pId, slide]);
            return await presentationData;
        } catch (error) {
            //dealt with error
            return await presentationData;
        }
    };

    return {
        createuser : createUser,
        getuser : getUser,
        deleteuser : deleteUser,
        cleardb : clearDB,
        updateuser : updateUser,
        userlogin : userLogin,
        createpresentation : createPresentation,
        getpresentation : getPresentation,
        deletepresentation : deletePresentation,
        updatepresentation : updatePresentation,
    }
};

module.exports = db;

