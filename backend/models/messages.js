/*
	Database model for messages. Each message has a asender, receiver, and message type
*/
module.exports = function (sequelize, DataTypes) {

	const Messages = sequelize.define("Messages", {
		messageId: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			autoIncrement: true
		},
		// userId of the sender
		senderId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		// userID of the receiver
		receiverId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		// If 1, message is a session key. If 2, message is a message
		type: {
			type: DataTypes.INTEGER
		},
		// The string needs to be very large to fit RSA ciphertext
		message: {
			type: DataTypes.STRING(4096),
		}
	})


	return Messages;
}