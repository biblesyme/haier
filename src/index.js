import React from 'react'

module.exports = [
	{
		path: '/',
		component: require('./app'),
		routes: [
			require('./routes/Dashboard'),
			require('./routes/Editor'),
			require('./routes/MarkDown'),
		]

	},

]