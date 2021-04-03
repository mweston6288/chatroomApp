/**
 * API routes related to users
 */
const db = require("../models");
const {Op} = require("sequelize");
const passport = require("../config/passport");
const forge = require("node-forge");
module.exports = function (app) {
	// create a new user account
	// If successful, return the user id and name
	// If username already exists, return the error instead
	app.post("/api/newUser", function (req, res) {
		const rsa = forge.rsa;
		const keypair = rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
		db.Users.create({
			username: req.body.username,
			password: req.body.password,
			publicKey: keypair.publicKey	
		}).then(function (results) {
			// return an object containing only the username and userId.			
			const response = {
				userId: results.dataValues.userId, 
				username: results.dataValues.username,
				key: keypair.privateKey
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
	// Login using the passport.authenticate middleware with our local strategy.
	// If the user has valid login credentials, send back the user details.
	// Otherwise the user will be sent an error
	app.get("/api/user/:user", function (req, res) {
		// return only username
		db.Users.findOne({ 
			attributes: ["username", "userId", "online"],
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
	app.post("/api/contacts", function(req,res){
		db.Users.findAll({
			attributes: ["username", "userId", "online"],
			where:{
				userId:{
					[Op.or]: req.body.users
				}
			}
		}).then((response)=>{
			let results = []
			response.forEach(element => {
				results.push(element.dataValues)
			});
			res.json(results);
		})
	})
}