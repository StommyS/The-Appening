const pg = require("pg");
const dbURI = "postgres://qgmznzykbumzex:bdde0f1eda44c90c849c120f53b24c702aae8d782adb6f11b33bb535cb00d284@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com:5432/d1kp021qnmfhaf" + "?ssl=true";
const connstring  = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({ connectionString: connstring });

const cors = require('cors');
const express = require('express');
const app = express(); //server-app

// Sindres testkoder -------------------------------------
const db = require("./modules/db.js")(process.env.dbconnection)
const presentationRoutes = require("./routes/presentations.js")
const userRoutes = require("./routes/users.js")
const loginRoutes = require("./routes/users.js")
//--------------------------------------------------------




// middleware --------------------------------------------
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body

// Sindres testkoder--------------------------------------
app.use("/users", userRoutes);// uses the code in routes users
app.use("/presentation", presentationRoutes)
//--------------------------------------------------------



// start server ------------------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port 3000!');
});