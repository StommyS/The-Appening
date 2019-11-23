const express = require("express");
const route = express.Router();

const secrets = require('../secret.js');
const dbURI = secrets.dbURI;
const dbConnection  = process.env.DATABASE_URL || dbURI;
const db = require("../modules/db")(dbConnection);


route.post('/', async function (req, res) {
    let updata = req.body;

    try {
        let createdPresentation = await db.createpresentation(updata.title, updata.slide, updata.userid);
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

// Update TITLE
route.put('/', async function (req, res) {
    let updata = req.body;

    try {
        let updatedPresentation = await db.updatepresentation(updata.title, updata.pId);
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

// Update CONTENT
route.put('/update', async function (req, res) {
    let updata = req.body;

    try {
        let updatedSlide = await db.updateslide(updata.slide, updata.pId);
        if(await updatedSlide) {
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
        presentation= await db.getpresentation(updata.userid);
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
        let deletedPresentation = await db.deletepresentation(updata.pId);
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
