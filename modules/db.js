const pg = require("pg");

const db = function(dconnectionString) {
    const pool = new pg.Pool({ connectionString: dconnectionString });

    async function runQuery(query, params){
        const res = await pool.query(query, params);
        let response = res.rows; // Did we get anything?? Dont care. SEP
        return response
    }

    const createUser = async function(name, pwhash, email) {
        let userData = null;
        try {
            userData =  await runQuery('INSERT INTO "user" (id, "username", "password", "email") VALUES(DEFAULT, $1, $2, $3) RETURNING *',[name, pwhash, email]);
            return await userData[0];
        } catch (error) {
            // expected failure points: user already exists, no data sent, no database available.
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

    const createPresentation = async function(title, slide, userid, theme) {
        let presentationData = null;

        try {
            presentationData = await runQuery('INSERT INTO presentations ("title", "slide", "theme", "userid", "writable", "owner") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                [title, slide, theme, userid, true, userid]);
            return await presentationData[0];
        } catch (error) {
            //we about to find out
            return await presentationData;
        }
    };

    const getPresentations = async function(userid) {
        let presentationData = null;

        try {
            presentationData =  await runQuery('SELECT * FROM public.presentations WHERE "userid" = $1', [userid]);
            return await presentationData;
        } catch (error) {
            // expected failure points: no connection, no such user
            return presentationData;
        }
    };

    const deletePresentation = async function(pId) {
        let presentationData = null;

        try {
            presentationData = await runQuery('DELETE FROM public.presentations WHERE "pId" = $1', [pId]);
            return await presentationData[0];
        } catch (error) {
            //deal with error
            return await presentationData;
        }
    };

    const nukePresentations = async function (userID) {
      let deleted = null;

      try {
          deleted = await runQuery('DELETE FROM public.presentations WHERE "owner" = $1', userID);
      }
      catch (error) {
          console.log(error);
          return deleted;
      }
    };

    const updatePresentation = async function(title, slides, theme, pId) {
        let presentationData = null;

        try {
            presentationData = await runQuery('UPDATE public.presentations SET "title" = $1, "slide = $2, "theme = $3 WHERE "pId" = $4 RETURNING *',[title, slides, theme, pId]);
            return await presentationData[0];
        } catch (error) {
            //deal with error
            return await presentationData;
        }
    };

    const sharePresentation = async function(title, slides, theme, owner, recipient) {
        let sharedPresentation = null;

        try {
            sharedPresentation = await runQuery('INSERT INTO presentations ("title", "slide", "theme", "userid", "writable", "owner") VALUES ($1, $2, $3, $4, $5, $6',
                [title, slides, theme, recipient, false, owner]);
            return await sharedPresentation;
        }
        catch (error) {
            console.log(error);
            return sharedPresentation;
        }
    };

    const updateSlide = async function(slide, pId) {
        let presentationData = null;

        try {
            presentationData = await runQuery('UPDATE public.presentations SET "slide" = $1 WHERE "pId" = $2 RETURNING *',[slide, pId]);
            return await presentationData[0];
        } catch (error) {
            //deal with error
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
        getpresentation : getPresentations,
        deletepresentation : deletePresentation,
        updatepresentation : updatePresentation,
        updateslide : updateSlide,
        sharepresentation : sharePresentation,
        deleteyours : nukePresentations
    }
};

module.exports = db;