/**
 * Model for users. Users contains an id, username, and password
 * password is encrypted using bcrypt before being set
 */
const bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {

	const Users = sequelize.define("Users",{
		userId: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			autoIncrement: true
		},
		// every username is unique
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		// password is encrypted before insertion
		password: {
			type: DataTypes.STRING,
			set(value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			}
		},
		// THe user's public key information
		publicKey: {
			type: DataTypes.JSON
		},
		// An integer value representing the time when the user last pinged the server
		// The default build uses the number of milliseconds since January 1, 1970
		online:{
			type: DataTypes.BIGINT,
		}
	})

	// Creating a custom method for our User model. This will check if an
	// unhashed password entered by the user can be compared to the hashed 
	// password stored in our database
	Users.prototype.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	};

	return Users;
}