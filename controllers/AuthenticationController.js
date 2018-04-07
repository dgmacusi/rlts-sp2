var User = require(`${__dirname}/../models/User`);

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
				res.render('login', { title : "MyApp" , error : err})
			} else {
				req.session.username = user.username
				req.session.authenticated = true
				return next()
			}
		})


	}, 
	authenticate : function (req, res, next) {
		if (req.session.authenticated) {
			return next()
		} else {
			res.redirect('/login')
		}
	}, 
	signout : function (req, res, next) {
		req.session.destroy(function (err) {
			if (err) throw err;

			res.redirect('/login')
		})
	}
}