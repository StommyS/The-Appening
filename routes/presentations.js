const express = require("express")
const route = express.Router();


route.get("/:presentationID", function(req,res,next){

})


//base/applications/presentationID/slideID
route.get("/:presentationID/:slideID", function(req,res,next){

})

module.exports = route;