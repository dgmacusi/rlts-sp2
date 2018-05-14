var Dashboard = require(`${__dirname}/../models/Dashboard`);

module.exports = {
	getHomePage : function (req, res, next) {
		Dashboard.getTopStatistics(function (err, statistics) {
			res.render('dashboard', { statistics : statistics })
		})
	}
}
