### 1. 涉及format的参数
```js
{
  resourceType: 'containerHost',
  data: {
    deployMode => {
      standalone: 0,
      masterSlave: 1,
      mycatCluster: 2,
    },
    masterSlaveOption => {
      1 master & 1 slave: 0,
      1 master & 2 slave: 1,
    }
  },
}
```
