/**
 * API routes related to users
 */
const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {
	// create a new user account
	// If successful, return the user id and name
	// If username already exists, return the error instead
	app.post("/api/newUser", function (req, res) {
		db.Users.create({
			username: req.body.username,
			password: req.body.password,
		}).then(function (results) {
			// return an object containing only the username and userId.
			const response = {
				userId: results.dataValues.userId, 
				username: results.dataValues.username
			};
			res.json(response);
			res.end();
		}).catch(function(err){
			res.json(err);
		});
	});
	// Login using the passport.authenticate middleware with our local strategy.
	// If the user has valid login credentials, send back the user details.
	// Otherwise the user will be sent an error
	app.post("/api/user", passport.authenticate("local"), function (req, res) {
		// return only username and userId
		const response = {
			userId: req.user.dataValues.userId, 
			username: req.user.dataValues.username
		}
		res.json(response);
	});
	// Update the user's password
	// Authenticate with Passport prior to update
	// If authentication fails, passport returns an error without update
	app.put("/api/user", passport.authenticate("local"), function(req,res){
		db.Users.update({
			password: req.body.newPassword
		},{
			where: {
				userId:req.body.userId
			}
		}).then((response)=>{
			res.json(response);
		})
	})
}