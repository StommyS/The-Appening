const express = require("express");
const route = express.Router();

const secrets = require('../secret.js');
const dbURI = secrets.dbURI;
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection);

//-------------End points presentations--------------------------------

route.post('/', async function (req, res) {
    let updata = req.body;

    try {
        let createdPresentation = await db.createpresentation(updata.title, updata.slide);

        if(await createdPresentation) {
            res.status(200).json({message: "Presentation created successfully"});
        } else {
            res.status(500).json({message: "Couldn't create presentation!"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

route.post('/update', async function (req, res) {
    let updata = req.body;

    try {
        let newpresentation = updata.newpresentation;
        let newslide = updata.newslide;
        let updatedPresentation = await db.updatepresentation(newpresentation, newslide, updata.title, updata.slide);

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

route.get('/', async function(req,res) {
    let updata = req.body;
    let presentation = null; 

    try {
        presentation= await db.getpresentation(updata.title);

        if(await presentation) {
            await res.status(200).json({message: "Presentation found"});
        }
        else {
            res.status(500).json({message: "No presentations!"})//or nothing, or connection issues
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

route.delete('/', async function (req, res) {
    let updata = req.body;
    
    try {
        let deletedPresentation = await db.deletepresentation(updata.title);
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

module.exports = route;