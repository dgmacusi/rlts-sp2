var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	addNotification : function (notif, cb) {
		var addQuery = 'INSERT INTO notification(title, body, hasAttachment, userId, beaconId) VALUE(?,?,?,?,?)'
		var findUser = 'SELECT * FROM user WHERE username=?'

		var beaconIdArray = notif.send_to.split(",");
		var userId = ''

		console.log(beaconIdArray)
		console.log(notif)

		mysqlConnection.query(findUser, [notif.username], function (err, user) {
			if (user[0] != null && user[0] != undefined) {
				userId = user[0].userId
			} else {
				userId = 0
			}

			beaconIdArray.forEach(function (beaconId, index) {
				mysqlConnection.query(addQuery, [notif.title, notif.body, 0, userId, beaconId], function (err, row) {
					if (index == beaconIdArray.length-1) {
						return cb(null, beaconId)
					}
				})
			})

		})
	}
}