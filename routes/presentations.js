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

module.exports = route;