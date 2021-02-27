const express = require("express");
const session = require("express-session");
const compression = require("compression");
const passport = require("./backend/config/passport");
const PORT = process.env.PORT || 8081; // change the number if needed
const app = express();


// Serve static content for the app from the "client" directory in the application directory.
app.use(express.static("client/build"));
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


// Start our server so that it can begin listening to client requests.
//db.sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log("App listening on Port " + PORT);
	});
//});
