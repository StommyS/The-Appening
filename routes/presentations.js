const express = require("express");
const route = express.Router();


route.get("/:presentationID", function(req,res,next){

});


//base/applications/presentationID/slideID
route.get("/:presentationID/:slideID", function(req,res,next){

});


route.put('/save', async function(req, res) {
    let updata = req.body; //the data sent from the client

    let finduser = undefined;//sql to fetch user
    let user = undefined; // execute sql and get user
    if (user) {
        // find presentation
        if(presentation) { // if already exists
            // presentation = new presentation we got here
            // push to database
            //if database push ok send 200
            //else send 500 database went wrong
        }
        //necessary??
        else {
            // push presentation as NEW
        }
    }
    else {
        res.status(400).json({message: "you don't exist"}).end();
    }
});

//-------------End points presentations--------------------------------

route.post('/', async function (req, res) {
    let updata = req.body;

    try {
        let createdPresentation = await db.createpresentation(updata.title);
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

route.post('/', async function (req, res) {
    let updata = req.body;

    try {
        let updatedPresentation = await db.updatepresentation(updata.title);
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
        presentation= await db.getpresentation(updata.slide);
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