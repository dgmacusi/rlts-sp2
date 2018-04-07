var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();
const bcrypt = require('bcrypt');

module.exports = {

	authenticateUser : function(user, cb) {
		var query = 'SELECT username, password FROM user WHERE username=?';

		mysqlConnection.query(query, [user.username], function (err, rows) {
			if (err) throw err

			if (rows.length) {
				bcrypt.compare(user.password, rows[0].password, function(err, res) {
					if (err) throw err

					if (res) {
						return cb(null, rows[0])
					} else {
						return cb('Username and password do not match.', null)
					} 
				});
			} else {
				return cb('No username found.', null)
			}
		})
	}, 
	getAllStaff : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="administrator" OR type="teacher" OR type="nonteaching"'
		
		mysqlConnection.query(getQuery, function (err, rows) {
			return cb(null, rows)
		})
	}

}





