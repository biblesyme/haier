export default {
  resources: [
    {
      title: '应用创建',
      icon: 'app',
      path: '/',
      key: '1',
      roles: ['internal', 'manager', 'admin', 'domainAdmin'],
    },
    {
      title: '信息中心',
      icon: 'desktop',
      path: '/information',
      key: '2',
      roles: ['admin'],
    },
    {
      title: '应用列表',
      icon: 'appstore',
      path: '/application',
      key: '3',
      roles: ['developer', 'manager'],
    },
    {
      title: '资源列表',
      icon: 'resource',
      path: '/resource',
      key: '4',
      roles: ['admin'],
    },
    {
      title: '应用中心',
      icon: 'appstore',
      path: '/applicationCenter',
      key: '9',
      roles: ['domainAdmin'],
    },
  ],
}
