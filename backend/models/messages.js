
module.exports = function (sequelize, DataTypes) {

	const Messages = sequelize.define("Messages", {
		messageId: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			autoIncrement: true
		},
		senderId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		receiverId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		// If 1, message is a session key. If 2, message is a message
		type: {
			type: DataTypes.INTEGER
		},
		message: {
			type: DataTypes.STRING,
		}
	})


	return Messages;
}