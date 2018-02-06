module.exports = {
	path: '/',
	exact: true,
	name: 'Dashboard',
	component: require('./Dashboard'),
	role: ['admin', 'domainAdmin', 'internal', 'manager'],
}
