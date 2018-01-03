module.exports = {
  path: '/',
  exact: true,
  name: 'ResourcesRequestIndex',
  component: require('./IndexPage'),
  role: ['admin', 'domainAdmin'],
}
