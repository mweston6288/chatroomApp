
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
		password: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		type: {
			type: DataTypes.INTEGER
		},
		message: {
			type: DataTypes.STRING,
		}
	})


	return Messages;
}