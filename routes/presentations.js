const express = require("express");
const route = express.Router();

const authenticate = require('../modules/auth.js');

const secrets = require('../secret.js');
const dbConnection  = process.env.DATABASE_URL || secrets.dbURI;
const db = require("../modules/db")(dbConnection);


route.post('/', authenticate, async function (req, res) {
    let updata = req.body;

    try {
        let createdPresentation = await db.createpresentation(updata.title, updata.slides, updata.userid, updata.theme);
        if(await createdPresentation) {
            res.status(200).json({message: "Presentation created successfully", id: createdPresentation.id});
        } else {
            res.status(500).json({message: "Couldn't create presentation!"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

route.post('/share', authenticate, async function (req, res) {
   let updata = req.body;

   try {
       let shareTo = await db.getuser(updata.recipient);
       if(await shareTo) {
           try {
               let sharedPresentation = await db.sharepresentation(updata.title, updata.slides, updata.theme, updata.userid, shareTo.id);
               if(await sharedPresentation) {
                   res.status(200).json({message: "Presentation shared successfully."});
               }
               else {
                   res.status(500).json({message: "Sharing failed."});
               }
           }
           catch(err) {
               console.log(err);
               res.status(500).json({error: err});
           }
       }
       else {
           res.status(500).json({message: "Sharing failed."});
       }
   }
   catch(err) {
       console.log(err);
       res.status(500).json({ error: err});
   }
});

route.put('/', async function (req, res) {
    let updata = req.body;

    try {
        let updatedPresentation = await db.updatepresentation(updata.title, updata.slides, updata.theme, updata.id);
        if(await updatedPresentation) {
            res.status(200).json({message: "Presentation updated successfully"});
        } else {
            res.status(500).json({message: "Couldn't update presentation!"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

route.get('/', authenticate, async function(req, res) {
    let updata = req.headers;
    let presentations = null;
    try {
        presentations = await db.getpresentation(updata.userid);
        if(await presentations) {
            await res.status(200).json({message: "Presentations found", allprts: presentations});
        }
        else {
            res.status(500).json({message: "No presentations!"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

route.delete('/', authenticate, async function (req, res) {
    let updata = req.body;
    
    try {
        let deletedPresentation = await db.deletepresentation(updata.id);
        if(await deletedPresentation) {
            res.status(200).json({message: "Deleted presentation"});
        } else {
            res.status(500).json({message: "Couldn't delete presentation!"});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
 });

route.delete('/all', authenticate, async function (req, res) {
    let updata = req.body;

    try {
        let alldeleted = await db.deleteyours(updata.userid);
        if(await alldeleted) {
            res.status(200).json({message: "All your presentations are now deleted."});
        }
        else {
            res.status(500).json({message: "Failed to delete all presentations"});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

route.delete('/unshare', authenticate, async function (req,res) {
    let updata = req.body;

    try{
        let unshared = await db.unsharepres(updata.userid, updata.title);
        if(await unshared) {
            res.status(200).json({message: "Presentation unshared."});
        }
        else {
            res.status(500).json({message: "Failed to unshare presentation"});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json()
    }

});

module.exports = route;
