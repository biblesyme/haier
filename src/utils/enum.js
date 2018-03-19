export function deployModeEnum(key)  {
  const deployMode = {
    0: '单机',
    1: '主从',
    2: '集群',
  }
  return deployMode[key]
}

// export masterSlaveOptionEnum {
//   0: '一主一从',
//   1: '一主两从',
// }

export function clusterTypeEnum(key) {
  const clusterType = {
    one: '单例',
    masterSlave: '主从',
    shared: '分片',
    standalone: '单机',
    cluster: '集群',
  }
  return clusterType[key]
}

export function exchangeTypeEnum(key) {
  const exchangeType = {
    fanout: '广播',
    topic: '主题',
    direct: '直连',
  }
  return exchangeType[key]
}

export function resourceTypeEnum(key) {
  const resourceType = {
    containerHost: '容器',
    mysql: 'MySQL',
    redis: 'Redis',
    rocketMQTopic: 'MQ',
    rabbitMQProducer: 'MQ',
    rabbitMQConsumer: 'MQ',
  }
  return resourceType[key]
}
