export default function(resource) {
  let a = resource.actions
  let state = resource.state
  return [
    {
      label: 'unsilence',
      icon: {
        type: 'unsilence',
      },
      key: 'unsilence',
      enabled: state === 'suppressed',
    },
    {
      label: 'silence',
      icon: {
        type: 'silence',
      },
      key: 'silence',
      enabled: state === 'active',
    },
    {
      divider: true,
    },
    {
      label: '禁用',
      icon: {
        type: 'stop',
      },
      key: 'disable',
      enabled: state === 'enabled',
    },
    {
      label: '启用',
      icon: {
        type: 'caret-right',
      },
      key: 'enable',
      enabled: state === 'disabled',
    },
    {
      label: '查看',
      icon: {
        type: 'eye',
      },
      key: 'detail',
      enabled: true,
    },
    {
      label: '删除',
      icon: {
        type: 'delete',
      },
      key: 'remove',
      popConfirm: true,
      enabled: state === 'disabled'
    },
    {
      divider: true,
    },
  ]
}
