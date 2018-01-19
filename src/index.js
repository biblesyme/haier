module.exports = [
	{
		path: '',
		component: require('./app'),
		routes: [
			require('./routes/Dashboard'),
			require('./routes/AreaManage'),
			require('./routes/Application'),
      require('./routes/ApplicationDetails'),
      require('./routes/ResourcesRequest'),
			require('./routes/Information'),
			require('./routes/Resource'),
			require('./routes/User'),
			require('./routes/Preview'),
		]
	},
]
