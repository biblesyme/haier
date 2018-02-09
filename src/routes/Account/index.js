module.exports = {
  path: '/accounts',
  name: 'Account',
  component: require('./Account'),
  routes: [
    require('./List'),
  ],
  role: ['admin'],
}
