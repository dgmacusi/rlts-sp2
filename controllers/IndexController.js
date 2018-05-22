module.exports = {
	getIndexPage : function (req, res, next) {
		res.render('index', { title : 'RLTS' })
	}, 
	getLoginPage : function (req, res, next) {
		res.render('login', { title : 'RLTS' })
	}, 
	getHomePage : function (req, res, next) {
		res.render('dashboard')
	},
	getHomePageOnLogin : function (req, res, next) {
		res.redirect('/home')
	},
	getTimelogPage : function (req, res, next) {
		res.render('timelogs', { title : "RLTS" })
	}, 
	getUserPage : function (req, res, next) {
		res.render('users', { title : "RLTS" })
	},
	getAddBeaconPage : function (req, res, next) {
		res.render('beacon-add', { title : "RLTS" })
	}
}