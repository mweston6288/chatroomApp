const db = require("../models");
module.exports = function (app) {
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

	app.get("/api/message/:userId", function (req, res) {
		// return only username
		db.Messages.findAll({
			where: {
				receiverId: req.params.userId
			}
		}).then(function (results) {
			results.forEach((r)=>{
				console.log(r)
				db.Messages.destroy({
					where:{
						messageId: r.dataValues.messageId
					}
				})
			})
			res.json(results);
		});
	})
}