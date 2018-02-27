module.exports = [
	{
		path: '',
		component: require('./app'),
		routes: [
			require('./routes/Dashboard'),
			require('./routes/Domain'),
			require('./routes/Application'),
      require('./routes/NewResource'),
      require('./routes/ApplicationDetails'),
      require('./routes/ResourcesRequest'),
			require('./routes/Information'),
			require('./routes/Resource'),
			require('./routes/Account'),
			require('./routes/Preview'),
			require('./routes/ApplicationCenter'),
		]
	},
]
