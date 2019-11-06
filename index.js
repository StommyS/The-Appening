const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const db = require("./modules/db")(process.env.dbconnection)
//const DEFAULT_PORT = 8080;

//const presentationRoutes = require("./routs/presentations")

//app.use("/presentation", presentationRoutes)


/*
app.get("/user/:userID", function(req,res,next){
    let user = db.getuser(req.body.userID)
    if(user){
        res.status(200).json(user);

    } else{
        res.status(404).end();
    }
})
*/

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.listen(app.get('port'), function () {console.log('server running', app.get('port'));});