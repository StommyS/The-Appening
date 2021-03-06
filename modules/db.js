const pg = require("pg");

const db = function(dconnectionString) {
    const pool = new pg.Pool({ connectionString: dconnectionString });

    async function runQuery(query, params){
        const res = await pool.query(query, params);
        let response = res.rows; // Did we get anything?? Dont care. SEP
        return response
    }

    const createUser = async function(name, pwhash, email, salt) {
        let userData = null;
        try {
            userData =  await runQuery('INSERT INTO "user" (id, "username", "password", "email", "salt") VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *',[name, pwhash, email, salt]);
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
            return userData;
        }
    };

    const deleteUser = async function(name) {
        let userData = null;
        try {
            userData =  await runQuery('DELETE FROM public."user" WHERE "username" = $1 RETURNING *',[name]);
            return await userData[0];
        } catch (error) {
            return userData;
        }
    };

    const clearDB = async function() {
        try {
            await runQuery('DELETE FROM "user" RETURNING *');
            return await true;
        } catch (error) {
            return false;
        }
    };

    const updateUser = async function(id, name, pwhash, email) {
        let userData = null;
        
        try {
            userData = await runQuery('UPDATE "user" SET "username" = $2, "password" = $3, "email" = $4 WHERE id = $1 RETURNING *',[id, name, pwhash, email]);
            return await userData;
        } catch (error) {
            return userData;
        }
    };

    const createPresentation = async function(title, slide, userid, theme) {
        let presentationData = null;
        try {
            presentationData = await runQuery('INSERT INTO presentations ("title", "slides", "theme", "userid", "writable", "owner") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                [title, slide, theme, userid, true, userid]);
            return await presentationData[0];
        } catch (error) {
            return await presentationData;
        }
    };

    const getPresentations = async function(userid) {
        let presentationData = null;

        try {
            presentationData =  await runQuery('SELECT * FROM public.presentations WHERE "userid" = $1', [userid]);
            return await presentationData;
        } catch (error) {
            return presentationData;
        }
    };

    const deletePresentation = async function(id) {
        let presentationData = null;

        try {
            presentationData = await runQuery('DELETE FROM public.presentations WHERE "id" = $1 RETURNING *', [id]);
            return await presentationData[0];
        } catch (error) {
            return await presentationData;
        }
    };

    const unshareall = async function (userID) {
      let deleted = null;

      try {
          deleted = await runQuery('DELETE FROM public.presentations WHERE "owner" = $1 RETURNING *', [userID]);
          return await deleted;
      }
      catch (error) {
          return deleted;
      }
    };

    const updatePresentation = async function(title, slides, theme, id) {
        let presentationData = null;
        try {
            presentationData = await runQuery('UPDATE public.presentations SET "title" = $1, "slides" = $2, "theme" = $3 WHERE "id" = $4 RETURNING *',[title, slides, theme, id]);
            return await presentationData[0];
        } catch (error) {
            return await presentationData;
        }
    };

    const sharePresentation = async function(title, slides, theme, owner, recipient) {
        let sharedPresentation = null;
        try {
            sharedPresentation = await runQuery('INSERT INTO presentations ("title", "slides", "theme", "userid", "writable", "owner") VALUES ($1, $2, $3, $4, $5, $6)',
                [title, slides, theme, recipient, false, owner]);
            return await sharedPresentation;
        }
        catch (error) {
            return sharedPresentation;
        }
    };

    const unsharePresentation = async function(owner, title) {
        let unshared = null;

        try {
            unshared = await runQuery('DELETE FROM public.presentations WHERE "owner" = $1 AND "title" = $2 AND "writable" = $3 RETURNING *', [owner, title, false]);
            return await unshared;
        }
        catch(error) {
            return unshared;
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
        sharepresentation : sharePresentation,
        unsharepres : unsharePresentation,
        deleteyours : unshareall
    }
};

module.exports = db;