const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes);

//const presentationRoutes = require("./routes/presentations.js")
//const loginRoutes = require("./routes/users.js")
//app.use("/users", loginRoutes); // uses the code in routes/users
//app.use("/presentation", presentationRoutes)

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port 3000!');
});