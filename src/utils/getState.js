const defaultStateMap = {
  pendding: {
    color: 'orange',
  },
  denied: {
    color: 'red',
  },
  confirmed: {
    color: 'green',
  },
  activating: {
    color: 'green',
  },
  enabled: {
    color: 'green',
  },
  active: {
    color: 'red',
  },
  created: {
    className: 'text-info'
  },
  creating: {
    className: 'text-info'
  },
  deactivating: {
    type: 'loading',
    className: 'text-info',
  },
  degraded: {
    className: 'text-warning'
  },
  unhealthy: {
    className: 'text-error',
  },
  backedup: {
    type: 'icon icon-backup',
    className: 'text-success',
  },
  healthy: {
    className: 'text-success',
  },
  'inactive': {
    className: 'text-error',
  },
  disconnected: {
    className: 'text-warning'
  },
  error: {
    className: 'text-error'
  },
  'running': {
    className: 'text-success'
  },
  'updating-active': {
    className: 'text-success'
  },
  erroring: {icon: 'icon icon-alert',         color: 'text-error'  },
  'initializing': {icon: 'icon icon-alert',         color: 'text-warning'},
  'migrating': {icon: 'icon icon-info',          color: 'text-info'   },
  'provisioning': {icon: 'icon icon-circle',        color: 'text-info'   },
  'pending-delete': {icon: 'icon icon-trash',         color: 'text-muted'  },
  'pending-restart': {icon: 'icon icon-history',       color: 'text-warning'},
  'purged': {icon: 'icon icon-purged',        color: 'text-error'  },
  'purging': {icon: 'icon icon-purged',        color: 'text-info'   },
  'reconnecting': {icon: 'icon icon-alert',         color: 'text-error'  },
  'registering': {icon: 'icon icon-tag',           color: 'text-info'   },
  'reinitializing': {icon: 'icon icon-alert',         color: 'text-warning'},
  'removed': {icon: 'icon icon-trash',         color: 'text-error'  },
  'removing': {icon: 'icon icon-trash',         color: 'text-info'   },
  'requested': {icon: 'icon icon-tag',           color: 'text-info'   },
  'restarting': {icon: 'icon icon-adjust',        color: 'text-info'   },
  'restoring': {icon: 'icon icon-medicalcross',  color: 'text-info'   },
  'starting': {icon: 'icon icon-adjust',        color: 'text-info'   },
  'stopped': {icon: 'icon icon-circle',        color: 'text-error'  },
  'stopping': {icon: 'icon icon-adjust',        color: 'text-info'   },
  'unknown': {icon: 'icon icon-help',          color: 'text-warning'},
  'updating': {icon: 'icon icon-tag',           color: 'text-info'   },
  'waiting': {icon: 'icon icon-tag',           color: 'text-info'   },
  'alerting': {icon: 'icon icon-alert',         color: 'text-error'  },
  'silenced': {icon: 'icon icon-alert',         color: 'text-warning'},
}

export default function(state) {
  return defaultStateMap[state]
}
