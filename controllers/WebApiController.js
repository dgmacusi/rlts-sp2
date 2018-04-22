var User = require(`${__dirname}/../models/User`);
var Beacon = require(`${__dirname}/../models/Beacon`);

module.exports = {
	login : function (req, res, next) {
		console.log(req.body)
		var user = {
			username : req.body.username,
			password : req.body.password
		}
		
		User.authenticateUser(user, function (err, user) {
			if (err) {
				console.log(err)
				res.json({ user : {
					username : null, 
					authenticated : false
				}})
			} else {
				res.json({ user : {
					username : user.username, 
					authenticated : true
				}})
			}
		})


	}
}
