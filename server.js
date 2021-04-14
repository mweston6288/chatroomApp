const https = require("https");
const fs = require('fs');
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const passport = require("./backend/config/passport");

// These are the details needed to make as ecure connection for https
const https_options = {
	key: fs.readFileSync("./keys/server.key"),
	cert: fs.readFileSync("./keys/server.crt"),
};
const PORT = process.env.PORT || 8081; // change the number if needed
const app = express();


// Serve static content for the app from the "client" directory in the application directory.
app.use(express.static("client/build"));
// access the database models
const db = require("./backend/models");
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This is authentication process for passport
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

// link routes go here
require("./backend/routes/userApi")(app);
require("./backend/routes/messagesApi")(app);

// Start our server so that it can begin listening to client requests.
// start up sequelize and then create the https server
db.sequelize.sync().then(() => {
	https.createServer(https_options, app).listen(PORT, () => {
		console.log("App listening on Port " + PORT);
	});
});
