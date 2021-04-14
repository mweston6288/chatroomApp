/*
	API routes connected to message creation and retrieval
*/

const db = require("../models");
module.exports = function (app) {

	// Create a new message
	// This post request requires an object with a senderId, receiverId, message, and type field
	app.post("/api/newMessage", function (req, res) {
		db.Messages.create({
			senderId: req.body.senderId,
			receiverId: req.body.receiverId,
			message: req.body.message,
			type: req.body.type
		}).then(function (results) {
			res.json(results);
		}).catch(function (err) {
			res.json(err);
		});
	});

	// Retrieve all messages for a user
	// after retrieving them, delete them from the server
	app.get("/api/message/:userId", function (req, res) {
		db.Messages.findAll({
			where: {
				receiverId: req.params.userId
			}
		}).then(function (results) {
			// delete all messages retrieved
			db.Messages.destroy({
				where:{
					receiverId: req.params.userId
				}
			})
			res.json(results);
		});
	})
}