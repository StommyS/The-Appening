const express = require("express");
const cors = require("cors");//må installeres og brukes mens vi jobber med appen
const app = express();

app.use(cors());//allow all CORS requests

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("w/e");
});