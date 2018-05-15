var Dashboard = require(`${__dirname}/../models/Dashboard`);

module.exports = {
	getHomePage : function (req, res, next) {
		Dashboard.getTopStatistics(function (err, statistics) {
			console.log(statistics)
			res.render('dashboard', { statistics : statistics })
		})
	}, 
	getSystemActivity : function (req, res, next) {
  		var fromDate = new Date(new Date().setDate(new Date().getDate() - 7))
  		var from = fromDate.getFullYear() +'-'+ (fromDate.getMonth() + 1) + '-' + fromDate.getDate()
		var to = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' +	new Date().getDate()
	

		Dashboard.getSystemActivity(from, to, function (err, output) {
			res.json(output)
		})
	}, 
	getLocationActivity : function (req, res, next) {
  		var fromDate = new Date(new Date().setDate(new Date().getDate() - 7))
  		var from = fromDate.getFullYear() +'-'+ (fromDate.getMonth() + 1) + '-' + fromDate.getDate()
		var to = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' +	new Date().getDate()
	

		Dashboard.getLocationActivity(from, to, function (err, output) {
			res.json(output)
		})
	}, 
	getHeatmap : function (req, res, next) {
		Dashboard.getHeatmap(function (err, output) {
			res.json(output)
		})
	}, 
	getTopLocations : function (req, res, next) {
		var fromDate = new Date(new Date().setDate(new Date().getDate() - 7))
  		var from = fromDate.getFullYear() +'-'+ (fromDate.getMonth() + 1) + '-' + fromDate.getDate()
		var to = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' +	new Date().getDate()

		Dashboard.getTopLocations(from, to, function (err, output) {
			res.json(output)
		})
	}
}
