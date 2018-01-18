module.exports = {
  path: '/applications/:id',
  name: 'ApplicationDetails',
  component: require('./ApplicationDetails'),
  role: ['developer', 'manager', 'admin', 'domainAdmin'],
}
