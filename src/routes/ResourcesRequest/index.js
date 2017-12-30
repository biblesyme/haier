module.exports = {
  path: '/resourcesRequest',
  name: 'ResourcesRequest',
  component: require('./ResourcesRequest'),
  routes: [
    require('./routes/IndexPage'),
    require('./routes/PermissionsRequest')
  ]
}