/**
 * API routes related to users
 */
const db = require("../models");
const {Op} = require("sequelize");
const passport = require("../config/passport");

module.exports = function (app) {
	// create a new user account
	// If successful, return the user id and name
	// If username already exists, return the error instead
	// user public key will be sent at a later point
	// requires a username and password field be sent
	app.post("/api/newUser", function (req, res) {
		db.Users.create({
			username: req.body.username,
			password: req.body.password,
		}).then(function (results) {
			// return an object containing only the username and userId.			
			const response = {
				userId: results.dataValues.userId, 
				username: results.dataValues.username,
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
	// requires a username and password field be sent
	app.post("/api/user", passport.authenticate("local"), function (req, res) {
		// return only username and userId
		const response = {
			userId: req.user.dataValues.userId, 
			username: req.user.dataValues.username
		}
		res.json(response);
	});
	// Update user's online status
	// Online is equal to A BigInteger value given by Date.now()
	// representing the last time the user pinged the server.
	// If the user's last ping was more than 20 seconds ago, 
	// they are considered offline
	app.put("/api/online", function (req, res) {
		db.Users.update({
			online: Date.now()
		}, {
			where: {
				userId: req.body.userId
			}
		}).then((response) => {
			res.json(response);
		})
	})
	// Search for another user using their username
	// This is used when a user is searching for someone to chat with
	// If they exist, send back their name, id, online status, and public key
	app.get("/api/user/:user", function (req, res) {
		// return only username
		db.Users.findOne({ 
			attributes: ["username", "userId", "online", "publicKey"],
			where: {
				username: req.params.user
			}
		}).then(function (results) {
			let response = {};
			if (results == null){
				response = {
					error: "Name does not exist"
				}
			}
			else
				response = results.dataValues
			res.json(response);
		});
	}),
	// search for users based on their userId
	// This is used when someone else starts a conversation with the user
	// Retireves the user's name, id, public key, and online status
	app.get("/api/userId/:userId", function (req, res) {
		db.Users.findOne({
			attributes: ["username", "userId", "online", "publicKey"],
			where: {
				userId: req.params.userId
			}
		}).then(function (results) {
			let response = {};
			if (results == null) {
				response = {
					error: "Name does not exist"
				}
			}
			else
				response = results.dataValues
			res.json(response);
		});
	}),
	// Find all users in a user's contact list to check for updates on things like online status
	// The user is sent a list of only the users in their query who are online
	// requires an array of userIds be sent
	app.post("/api/contacts", function(req,res){
		db.Users.findAll({
			attributes: ["username", "userId", "online", "publicKey"],
			where:{
				userId:{
					[Op.or]: req.body.users
				}
			}
		}).then((response)=>{
			let results = []
			response.forEach(element => {
				// Discard any results where the last ping was more than 20 seconds ago
				if (Date.now() < element.dataValues.online + 20000)
					results.push(element.dataValues)
			});
			res.json(results);
		})
	})
	// update a user's public key
	// This is used after successful login verification
	// and is separate from normal login to reduce processing a keypair for invalid logins
	// requires an object with a ppbulicKey and userId field be passed to it
	app.post("/api/publicKey", function (req,res){
		db.Users.update({
			publicKey: req.body.publicKey
		}, {
			where: {
				userId: req.body.userId
			}
		}).then((response) => {
			res.json(response);
		})
	})
}