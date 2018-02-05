export function deployModeEnum(value)  {
  const deployMode = {
    0: '单机',
    1: '主从',
    2: '集群',
  }
  return deployMode[value]
}

// export masterSlaveOptionEnum {
//   0: '一主一从',
//   1: '一主两从',
// }
