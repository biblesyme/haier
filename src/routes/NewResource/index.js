module.exports = {
  path: '/applications/:id/NewResource',
  name: 'NewResource',
  component: require('./NewResource'),
  role: ['developer', 'manager', 'domainAdmin'],
}
