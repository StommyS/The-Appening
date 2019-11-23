const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', express.static('public'));

const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes);

const presentationRoutes = require("./routes/presentations.js");
app.use("/presentations", presentationRoutes);

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port 3000!');
});