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
            return await userData[0];
        } catch (error) {
            // expected failure points: user already exists, no data sent, no database available.
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

    const createPresentation = async function(title, slide) {
        let presentationData = null;

        try {
            presentationData = runQuery('INSERT INTO presentations ("title", "slide", "userid") VALUES($1, $2, $3) RETURNING *',[title, slide, 30]);
            return await presentationData;
        } catch (error) {
            //we about to find out
            return await presentationData;
        }
    };

    const getPresentation = async function(title) {
        let presentationData = null;

        try {
            presentationData =  await runQuery('SELECT * FROM public.presentations WHERE "title" = $1', [title]);
            return await presentationData;
        } catch (error) {
            // expected failure points: no connection, no such user
            return presentationData;
        }
    };

    const deletePresentation = async function(title) {
        let presentationData = null;

        try {
            presentationData = runQuery('DELETE * FROM "presentations" WHERE title = $1',[title]);
            return await presentationData;
        } catch (error) {
            //dealth with error
            return await presentationData;
        }
    };

    const updatePresentation = async function(oldtitle, oldslide, newtitle, newslide) {
        let presentationData = null;

        try {
            presentationData = await getPresentation(oldtitle, oldslide);

            if(presentationData) {
                let updated = await runQuery('UPDATE "presentations" SET "title" = $2, "slide" = $3 WHERE pId = $1 RETURNING *',[oldtitle, oldslide, newtitle, newslide, 30]);
                return await updated[0];
            }
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
        createpresentation : createPresentation,
        getpresentation : getPresentation,
        deletepresentation : deletePresentation,
        updatepresentation : updatePresentation,
    }
};

module.exports = db;