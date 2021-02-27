/**
 * Model for users. Users contains an id, username, and password
 * password is encrypted using bcrypt before being set
 * Each user can have 0 or more Notes.
 */
const bcrypt = require("bcrypt");
const jssha = require("jssha");
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
			set(value){
				const sha = new jssha("SHA-512", "TEXT");
				sha.update(value)
				this.setDataValue('username', sha.getHash("HEX"))
			}
		},
		// password is encrypted before insertion
		password: {
			type: DataTypes.STRING,
			set(value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			}
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