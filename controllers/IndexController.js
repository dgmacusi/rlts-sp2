module.exports = {
	getIndexPage : function (req, res, next) {
		res.render('index', { title : 'Initial Web App' })
	}, 
	getLoginPage : function (req, res, next) {
		res.render('login', { title : 'Initial Web App' })
	}, 
	getHomePage : function (req, res, next) {
		res.render('dashboard')
	},
	getHomePageOnLogin : function (req, res, next) {
		res.redirect('/home')
	},
	getTimelogPage : function (req, res, next) {
		res.render('timelogs', { title : "MyApp" })
	}, 
	getUserPage : function (req, res, next) {
		res.render('users', { title : "MyApp" })
	},
	getAddBeaconPage : function (req, res, next) {
		res.render('beacon-add', { title : "MyApp" })
	}
}