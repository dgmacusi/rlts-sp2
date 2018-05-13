var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	addNotification : function (notif, cb) {
		var addQuery = 'INSERT INTO notification(title, body, hasAttachment, userId, beaconId, date, downloadLink) VALUE(?,?,?,?,?,?, ?)'
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
				mysqlConnection.query(addQuery, [notif.title, notif.body, 0, userId, beaconId, new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2), notif.downloadLink], function (err, row) {
					if (index == beaconIdArray.length-1) {
						return cb(null, beaconId)
					} 	
				})
			})

		})
	}, 
	getAllNotifications : function (cb) {
		var getQuery = 'SELECT * FROM notification WHERE DATE(date)=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?'
		var notifArray = []

		mysqlConnection.query(getQuery, [new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)], function (err, rows) {
			if (!(err) && rows.length > 0) {
				rows.forEach(function (row, index) {

					mysqlConnection.query(userQuery, [row.userId], function (err, user) {
						if (user[0] != null && user[0] != undefined) {
							row.sender = user[0].lastName + ', ' + user[0].firstName 
						} else {
							row.sender = 'NA'
						}

						var n = {
							notificationId : row.notificationId, 
							title : row.title, 
							body : row.body, 
							beaconId : row.beaconId, 
							sender : row.sender, 
							downloadLink : row.downloadLink
						}

						notifArray.push(n)
						
						if (index == rows.length-1) {
							console.log(notifArray)
							return cb(null, notifArray)
						}

					})
				})
			} else {
				return cb("No notifications found", null)
			}
		})

	}
}