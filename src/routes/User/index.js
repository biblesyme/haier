module.exports = {
  path: '/user',
  name: 'User',
  component: require('./User'),
  routes: [
    require('./List'),
  ],
  role: ['admin'],
}
