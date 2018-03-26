module.exports = {
  path: '/applications/:id',
  name: 'ApplicationDetails',
  component: require('./ApplicationDetails'),
  role: ['developer', 'manager', 'domainAdmin', 'admin', 'internal'],
}
