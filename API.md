# Haier Project Detail Design
Base on what we discuss last week. Following is the design for the project.

## Roles of platform

* 内部员工： internal（账号名称为非A开头识别为内部员工，并且没有符合其他角色的条件）
* 外部员工： external（账号名称为A开头识别为外部员工，并且没有符合其台角色条件）
* 项目经理： manager（当内部员工账号关联一个项目时，他的平台角色成为项目经理）
* 开发者： developer（当一个外部员工关联一个项目时，他的平台角色成为开发者）
* 团队长： domainAdmin（当一个内部员工或项目经理与一个领域关联时，他的平台角色成为团队长）
* 管理员： admin（当一个内部员工、团队长、项目经理被平台设置为管理员时，他的平台角色可以选择为管理员）

## Menu and Access Control
1. 菜单：
    1. 审批管理
        1. 资源审批（管理员，团队长）
        2. 我发起的审批（管理员，团队长，项目经理）
    2. 资源管理
        1. 应用创建（非A账号用户、项目经理、团队长、管理员）
        2. 信息中心（管理员）
        3. 应用列表（管理员，团队长，项目经理，开发者：只读）
        4. 资源列表（管理员）
    3. 权限管理
        1. 用户管理（管理员）
        2. 领域管理（管理员）

## Resource objects in our platform

### Account
Following 3 ways to import a account to our platform

* When a user login into Haier portal and switch to our platfrom at the first time, our platform get account information from login server of haier and automatically import the account information.
* When a manager set a project participant and the account can not be found in our platform, platform will query the user information from user system and import it.
* When a admin set a domain admin and the account can not be found in platform, our platform will query the user information from user system and import it.

#### Account State

* active - default state of an account, you can **deactivate** it when it is active.
* inactive - you can **activate** it when the account is inactive.
* activating - middle state between active and inactive.
* deactivating - middle state between active and inactive.

#### Account Attribute

* id
* name
* state
* roles
* externalId - link to user number of a Haier account.

#### Related links

* projects - find out the projects that related to this account.
* approvals - when the role is `domainAdmin` or `admin`, find out approvals this account can approve.
* requests - find out the approvals this user request.

---

### Subsystem
Subsystem is the real resource worker. Our platform require that the subsystem should have a http api server for our platform to talk to. For now, we can only management the subsystems with database operation directly.

#### Subsystem State

* active - this means subsystem is ok.
* inactive - we can set subsystem inactive and it won't do any operation of this subsystem.

#### Subsystem Attribute

* id
* name
* entrypoint - http entrypoint. It should be like `http://<ip_or_hostname>:<service_port>`
* state
* description

#### Related links

* syncups - get the state of syncup status between platform and subsystem.
* resourceTypes - get the list of resource this subsystem support

---

### Domain
Domain is a concept from Haier. Each domain is a category of projects. Domain **can be created** by our platform.

#### Domain state

* creating
* active - default state of a domain. you can **update**, **addAdmin**, **deleteAdmin**, and **remove** when it is in this state.
* updating - middle state when update a domain attribute including adding new domain admins.
* removing - middle state between update and remove.
* removed - end state of a domain.

#### Domain Attribute

* id
* name
* state
* description

#### Related links

* admins - get domains of this domain.
* projects - get projects that belong to this domain.

---

### DomainAdamin
Domain admin **can be set** in our platform. You can set it in list domain page.

#### DomainAdmins state

* active
* removed

#### DomainsAdmin Attribute

* id
* domainId
* accountId
* state
* accountName
* accountExternalId

#### Related links

* account
* domain

---

### Project
Project is a concept from Haier. A project is aim to create an application and includes some resources. Project record **can be created** in UI.

* After created a project in UI, the project will be in pending state and all the resources related to this project will be in `pending` state too.
* Resource approvals will be created
* If one of the resource is approved, the project will be active logically and set to other state.
* If none of those resources are approved, the project will be in `rejected` state.


#### Project state

* Pending - When a project has been imported, it will be in pending state. If any resources of this project have been approvaled, this projct will no longer be in pending state.
* Rejected - If all the resource approvals have been denied, the project will be in rejected state
* ApplyingResource - If there are any resources of this project is being pending state, this project will be in applyingResource state.
* DeployingResource - If there any resources of this project is being deploying state, this project will be in deployingResource state. This state overwrites state ApplyingResource.
* ResourceReady - Target state of a project. This means all the resource of this project is deployed. You can **addMember** or **removeMember** in this state.
* Updating - Updating project member state.

#### Project Attribute

* id
* name
* scode - Project external unique id.
* creatorId
* domainId
* state
* operationManager
* createDate

#### Related links

* creator - Get creator account info
* domain - get domain of this project
* projectParticipants - Get project members
* resources - Get resource of this projects.

---

### ProjectParticipant
Project member

#### ProjectParticipant state

* active
* removed

#### ProjectParticipant Attribute

* id
* accountId
* projectId
* type - manager or developer
* state
* accountName
* accountExternalId

#### Related links

* account
* project

---

### ResourceType
Supported Resource type in this platform. It includes schema of each resrouce.

#### ResourceType state

* active - default state of a resource type
* removed - when a resource schema has been updated, old resource should be set to removed and create a new one.

#### ResourceType attribute

* id
* name
* prefix - 3 character, prefix for id of this type of resource.
* subsystemId
* version - when update a resource type, it should increase the verison of it.
* schema - it describe what a resource like in Rancher resource schema form.
* state
* description

#### Related links

* subsystem
* resources

---

### Resource
Resource items defined in our platform.

#### Resource state

* pending - When a resource has been requested but not approved, it will be pendding state.
* deploying - When a resource has been approved, our platform will begin to deploy the resource to their subsystem.
* ready - default state of a resource.
* deployError - When timeout deploying a resource or subsystem return error while deploying resource. you can **retry** when it is in this state.

#### Resource attribute

* id - 3 prefix + resource sequence
* resourceTypeId
* projectId
* version
* data - data includes resource data in resource type schema.
* state

#### Related links

* resourceType
* project

---

### Approval

#### Approval state

* pending - an approval is just requested.
* confirmed - an approval is just accepted by domain admin.
* passed - an approval is approved by admin.
* denied - approval is in denied state when domain admin or admin deny this approval.

#### Approval attribute

* id
* changeType - `create` or `updated` resource
* projectId
* resourceId
* state
* denidMessages
* requesterId
* requestTimestamp
* confirmTimestamp
* approveTimestamp
* denyTimestamp

#### Related links

* requester
* domainApprover
* adminApprover
* resource

---

### SyncupStatus
Organization information should be synced up with subsystem.

#### SyncupStatus state

* sync - same version between our platform and subsystem.
* syncing - syncing state.
* outsync - means not the same version between our platform and subsystem.

#### SyncupStatus attribute

* id
* syncupTarget - project, projectMember, domain, domainMember, resource. The resource should only support daily syncup.
* type - routine or daily
* last_syncup_time
* response_syncup_time
* subsystemId
* state

#### Related links

* subsystem

---

### Setting

#### Setting state

none

#### Setting attribute

* id
* type
* name
* activeVaule
* value

#### Related links
 none

## Functions of platform

### Rancher API SPEC
related link in [api_spec](https://github.com/rancher/api-spec/blob/master/specification.md#special-headers)

Schemas and resources should follow the description above.

### States Change Reaction
Websocket should be supported in this platform. You should subscribe the object changes with URI `/v1/ws/subscribe`.

### Resource of Haier Deploy

#### API of Resource Deploy
The following APIs are required for subsystems. They need to provide a endpoint and have the URI under this endpoint.


* Update domain information
	* URI: `Post /v1/domain`
	* Schema:

Input:

```json
{
	"id":"{uuid}",
	"type":"domainUpdate",
	"requestTimestamp":140000000, // unix timestamp with seconds
	"data":[
		{
			"operation":"create", // create, update or remove
			"domainId":1,
			"domainName":"互联互通",
			"domainAdmins":[
				"0123456789",
				"0123456788"
			]
		}
	]
}
```

Output:

```json
{
	"changedRows":1, // it should be the same as how many we put in the input
	"responseTimestamp": 1400000000, // unix timestamp with seconds.
	"domainIds":[
		1
	]
}

```


* Query domain information
	* URI: `Get /v1/domain`
	* Schema:

```json
{
	"type":"domainUpdates",
	"data":[
		{
			"domainId":1,
			"domainName":"互联互通",
			"domainAdmins":[
				"0123456789",
				"0123456788"
			]
		}
	]
}
```

* Query specific domain information 查询指定领域信息
    * URI: `Get /v1/domain/{id}`
    * Schema:

```json
{
	"type":"domainUpdates",
	"data":
    {
        "domainId":1,
        "domainName":"互联互通",
        "domainAdmins":[
            "0123456789",
            "0123456788"
        ]
    }
}
```

* Update project information
	* URI: `Post /v1/project`
	* Schema:
Input:

```json
{
	"id":"{uuid}",
	"type":"projectUpdate",
	"requestTimestamp":140000000, // unix timestamp with seconds
	"data":[
		{
			"operation":"create", // create, update or remove
			"projectId":1,
			"scode":"S01234",
			"projectManagers":[
				"0123456789",
				"0123456788"
			],
			"projectDeveloper":[
				"A123456789",
				"A123456788"
			]
		}
	]
}

```

Output:

```json
{
	"changedRows":1, // it should be the same as how many we put in the input
	"responseTimestamp": 1400000000, // unix timestamp with seconds.
	"scodes":[
		"S01234"
	]
}

```

* Query project information
	* URI: `Get /v1/project`
	* Schema:

```json
{
	"type":"projectUpdates",
	"data":[
		{
			"projectId":1,
			"scode":"S01234",
			"projectManagers":[
				"0123456789",
				"0123456788"
			],
			"projectDeveloper":[
				"A123456789",
				"A123456788"
			]
		}
	]
}

```

* Query specific project information 查询指定项目信息
    * URI: `Get /v1/project/{id}`
    * Schema:

```json
{
	"type":"projectUpdates",
	"data":
    {
        "projectId":1,
        "scode":"S01234",
        "projectManagers":[
            "0123456789",
            "0123456788"
        ],
        "projectDeveloper":[
            "A123456789",
            "A123456788"
        ]
    }
}
```

* Query resources information
	* URI: `Get /v1/resource`
	* Schema:

```json
{
	"type":"resources",
	"data":[
		{
			"id":"DTB1",
			"resourceType":"mysql",
			"data":{}, // resource data base on resource type schema
			"status":"ready", //ready, deploying or deployError
			"projectScode":""
		}
	]
}

```

* Query specific resource information
	* URI: `Get /v1/resource/{id}`
	* Schema:

```json
{
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{}, // resource data base on resource type schema
	"status":"ready", //ready, deploying or deployError
	"projectScode":""
}
```

* Resource update pre-check
	* URI: `Post /v1/resource/precheck`
	* Schema:

Input:

```json
{
	"changeType":"create", //create or update
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{}, // resource data base on resource type schema
	"projectScode":""
}
```

Output:

```json
{
	"id":"DTB1",
	"status":"pass",  //pass or error
	"message":""  //error message
}
```

* Resource update
	* URI: `Post /v1/resource`
	* Schema:

Input:

```json
{
	"changeType":"create", //create or update
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{}, // resource data base on resource type schema
	"projectScode":""
}
```

Output:

http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{}, // resource data base on resource type schema
	"state":"deploying",
	"projectScode":""
}
```

* Common error output:

```json
{
	"type":"error",
	"id":"xxxx-xxxx-xxxxxxxx-xxxx-xxxx", // uuid form
	"status":400, //http response status
	"code":"",
	"detail":"",
	"message":""
}
```

Following types of resource will be supported in this version.

---

#### PaaS

##### Parameters for deploy

* location
	* 青岛
	* 北京
* clusterName
* cpu(can modify)
* memory(can modify)
* diskSize(can modify)

##### Metric to show (won't support in this version)

* 资源使用率（已经分配给实例的资源数量/总应用的资源量）
* 健康实例数量：总实例数量


##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"CTH1",
	"type":"resource",
	"version":1,
	"resourceType":"containerHost",
	"data":{
		"location":"xxxxxx",
        "clusterName":"xxx",
        "cpu":10, // cpu core count
        "memory":2048, // in MB
        "diskSize": 1000 // in GB
	}, // resource data base on resource type schema
	"projectScode":"S123450"
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"CTH1",
	"type":"resource",
	"version":1,
	"resourceType":"containerHost",
	"data":{
		"location":"xxxxxx",
        "clusterName":"xxx",
        "cpu":10, // cpu core count
        "memory":2048, // in MB
        "diskSize": 1000 // in GB
	}, // resource data base on resource type schema
    "state":"deploying",
	"projectScode":"S123450"
}
```

Query Resource output with resource ID

```json
{
	"id":"CTH1",
	"type":"resource",
	"version":1,
	"resourceType":"containerHost",
	"data":{
		"location":"xxxxxx",
        "clusterName":"xxx",
        "cpu":10, // cpu core count
        "memory":2048, // in MB
        "diskSize": 1000, // in GB
        "instances": []
	}, // resource data base on resource type schema
    "state":"deploying",
	"projectScode":"S123450"
}
```


---

#### Mysql
##### Parameters for deploy

* location (machine room id)
* deployMode
	* option 0: standalone
	* option 1: masterSlave
	* option 2: mycatCluster
* masterSlaveOption
	* option 0: 1 master & 1 slave
	* option 1: 1 master & 2 slaves
* mycatClusterOption
	* managerNodeCount
	* dataNodeCount
* needBackup(can modify)
	* yes
	* no

##### Metric to show (won't support in this version)

- 24小时的慢查询数量
- 当前打开连接数（若是主从，则分开显示主从的连接数，若是集群显示mycat的即可）
- 当前运行的线程个数（若是主从，则分开显示主从的连接数，若是集群显示mycat的即可）
- 实例大小
- 记录锁定数量（若是主从，显示master的数量，若是集群显示mycat的即可）

##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{
		"location":"xxxxxx",
		"deployMode":"1",
		"masterSlaveOption":"0",
		"mycatClusterManagerNodeCount":0,
		"mycatClusterDataNodeCount":0,
		"backup":false,
	}, // resource data base on resource type schema
	"projectScode":"S123450"
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{
		"location":"xxxxxx",
		"deployMode":"1",
		"masterSlaveOption":"0",
		"mycatClusterManagerNodeCount":0,
		"mycatClusterDataNodeCount":0,
		"backup":false
	}, // resource data base on resource type schema
	"state":"deploying", // deploying, updating, deployError, ready
	"projectScode":""
}
```

Query Resource output with resource ID

```json
{
	"id":"DTB1",
	"type":"resource",
	"version":1,
	"resourceType":"mysql",
	"data":{
		"location":"xxxxxx",
		"deployMode":"1",
		"masterSlaveOption":"0",
		"mycatClusterManagerNodeCount":0,
		"mycatClusterDataNodeCount":0,
		"backup":false,
		"instances":[
			{
				"type":"master", // master, slave, managerNode, dataNode
				"ip":"1.2.3.4",
				"port":3306,
				"user":"root",
				"password":"test"
			}
		]
	}, // resource data base on resource type schema
	"state":"ready", // deploying, updating, deployError, ready
	"projectScode":""
}
```

---

#### RabbitMQProducer
##### Parameters for deploy

* location (machine room id)
* maxIO
* exchangeName
* exchangeType
	* topic
	* fanout
	* direct

##### Metric to show (won't support in this version)

* 消息总数
* 已经投递的消息数
* 没有投递的消息数


##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"RMP1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQProducer",
	"data":{
		"location":"xxxxxx",
		"maxIO":100,
		"exchangeName":"abcd",
		"exchangeType":"direct"
	}, // resource data base on resource type schema
	"projectScode":"S123450"
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"RMP1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQProducer",
	"data":{
		"location":"xxxxxx",
		"maxIO":100,
		"exchangeName":"abcd",
		"exchangeType":"direct"
	}, // resource data base on resource type schema
	"state":"deploying",
	"projectScode":"S123450"
}
```

Query Resource output with resource ID

```json
{
	"id":"RMP1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQProducer",
	"data":{
		"location":"xxxxxx",
		"maxIO":100,
		"exchangeName":"abcd",
		"exchangeType":"direct",
		"instances":[]
	}, // resource data base on resource type schema
	"state":"ready",
	"projectScode":"S123450"
}
```

---

#### RabbitMQConsumer
##### Parameters for deploy

* producerApplicationName(dropdown)
* exchangeName(dropdown)
* queueName(input)
* topicName(input if select a topic exchange type)
* RouteKey(input if select a direct exchange type)

##### Metric to show (won't support in this version)

* 消息总数
* 已经投递的消息数
* 没有投递的消息数

##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"RMC1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQConsumer",
	"data":{
		"producerApplicationScode":"S123451",
		"exchangeName":"abcd",
		"queueName":"",
		"topicName":"",
		"RouteKey":""
	}, // resource data base on resource type schema
	"projectScode":"S123450"
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"RMC1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQConsumer",
	"data":{
		"producerApplicationScode":"S123451",
		"exchangeName":"abcd",
		"queueName":"",
		"topicName":"",
		"RouteKey":""
	}, // resource data base on resource type schema
	"state":"deploying",
	"projectScode":"S123450"
}
```

Query Resource output with resource ID

```json
{
	"id":"RMC1",
	"type":"resource",
	"version":1,
	"resourceType":"rabbitMQConsumer",
	"data":{
		"producerApplicationScode":"S123451",
		"exchangeName":"abcd",
		"queueName":"",
		"topicName":"",
		"RouteKey":"",
		"instances":[]
	}, // resource data base on resource type schema
	"state":"ready",
	"projectScode":"S123450"
}
```

---

#### RocketMQ
##### Parameters for deploy

* location (machine room id)
* clusterType
	* standalone
	* cluster
* topicName(input)

##### Metric to show (won't support in this version)

* Tpoic生产者实例总数、生产者应用总数；
* Topic消费者实例总数、消费者应用总数；
* 1小时内消息总数

##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"RKM1",
	"type":"resource",
	"version":1,
	"resourceType":"rocketMQTopic",
	"data":{
		"location":"xxx",
		"clusterType":"standalone",
		"topicName":""
	}, // resource data base on resource type schema
	"projectScode":"S123450"
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"RKM1",
	"type":"resource",
	"version":1,
	"resourceType":"rocketMQTopic",
	"data":{
		"location":"xxx",
		"clusterType":"standalone",
		"topicName":""
	}, // resource data base on resource type schema
	"state":"deploying",
	"projectScode":"S123450"
}
```

Query Resource output with resource ID

```json
{
	"id":"RKM1",
	"type":"resource",
	"version":1,
	"resourceType":"rocketMQTopic",
	"data":{
		"location":"xxx",
		"clusterType":"standalone",
		"topicName":"",
		"instances":[]
	}, // resource data base on resource type schema
	"state":"ready",
	"projectScode":"S123450"
}
```

---

#### Redis
##### Parameters for deploy

* memorySize(can modify)
* location (machine room id)
* clusterType
	* standalone
	* masterSlave
	* shared
* Parameters
	* **Shared count** when cluster type is `shared`

##### Metric to show (won't support in this version)

* 今天一天的慢查询数量
* 命中率
* 内存使用百分比
* 当前连接数

##### Json example

Input

```json
{
	"changeType":"create", //create or update
	"id":"RED1",
	"type":"resource",
	"version":1,
	"resourceType":"redis",
	"data":{
		"memorySize":"100M",
		"location":"xxx",
		"clusterType":"masterSlave",
		"sharedCount":0
	}, // resource data base on resource type schema
	"state":"ready", // deploying, updating, deployError, ready
	"projectScode":""
}
```

Output: http status code 201

```json
{
	"changeType":"create", //create or update
	"id":"RED1",
	"type":"resource",
	"version":1,
	"resourceType":"redis",
	"data":{
		"memorySize":"100M",
		"location":"xxx",
		"clusterType":"masterSlave",
		"sharedCount":0
	}, // resource data base on resource type schema
	"state":"deploying", // deploying, updating, deployError, ready
	"projectScode":""
}
```

Query Resource output with resource ID

```json
{
	"id":"RED1",
	"type":"resource",
	"version":1,
	"resourceType":"redis",
	"data":{
		"memorySize":"100M",
		"location":"xxx",
		"clusterType":"masterSlave",
		"sharedCount":0,
		"instances":[
			{
				"ip":"1.2.3.4",
				"port":2379,
				"password"
			}
		]
	}, // resource data base on resource type schema
	"state":"ready", // deploying, updating, deployError, ready
	"projectScode":""
}
```

---


### SSO of Haier

The basic logic of SSO in Haier is to use shared cookie under the same root domain name. The platform should use the cookie to get informatin from Redis of login server. If found, the user is valid and ok. If not found, Platform should return code `401` to frontend and frontend should redirect to login address.

#### Information

Cookie Format: `csid=xxxx`
Login URL: `http://t.c.haier.net/login?url=<url_of_our_platform>`
Redis Query Key: `ClientSessionId:{cookie_value}`
Redis Return Data Sample:

```json
{
	"username":"01452142",
	"phonenumber":"18562824664",
	"mobilephone":"",
	"nickname":"于志强",
	"email":"yuzhiqiang@haier.com",
	"userOU":"/海尔集团董事局/海尔集团/690/690三自平台/690全球信息化平台/690信息创新/技术创新平台/互联互通平台/",
	"hrPosition":"IT开发与建设工程师"
}
```

**ps:**
The url of our platform in login url should use URL encoding to encode it.


#### Process of SSO

```
1. 用户访问APP
2. APP检测是否存在cooke：”csid=9DC093072EEA274D6DE99B6E32C8CBF7”
3. 不存在，则401到前端，前端根据识别到401请求，redirect到 http://t.c.haier.net/login?url=http://xxxx.c.haier.net
4. 若存在，则使用csid的值，查询登陆服务器的redis存储，查找csid是否有效，无效则返回401
    1. 查询使用的key例子：ClientSessionId:9DC093072EEA274D6DE99B6E32C8CBF7
    2. 返回的数据结构如下：{"username":"01452142","phonenumber":"18562824664","mobilephone":"","nickname":"于志强","email":"yuzhiqiang@haier.com","userOU":"/海尔集团董事局/海尔集团/690/690三自平台/690全球信息化平台/690信息创新/技术创新平台/互联互通平台/","hrPosition":"IT开发与建设工程师"}
5. 获得用户信息，进行处理
```

### Other Functions
#### Querying project basic information from other system
It needs to query the project information from other system in Haier with `scode`. Following is how to do it with the specific scode.

URI: `Get /api/app/alam/projects/{scode}`

Test environment in Haier: `http://10.138.40.220:8095/`


Output Schema:

```json
{
    "data": {
        "id": 630,
        "applicationId": "S01387",
        "applicationType": "企业内应用",
        "name": "产品中心",
       "shortName": "PROTUCT",
        "status": "使用中",
        "businessDomainId": "21",
        "businessDomain": "交互运营",
        "beneficiaries": "690",
        "applicationLocation": "海尔产业唯一的产品数据管理平台，承担产品营销属性及素材的存储、管理以及分发。",
        "goliveTime": 1467302400000,
        "userGroup": "各产业、终端平台等",
        "functionDescription": "产业自建类目、录入产品型号，存储产品信息及素材，并以销售样表为闸口、通过API的形式提供给终端平台使用。",
        "maintenanceLevel": null,
        "applicationStructure": "B/S",
        "portConnectType": "身份含密码",
        "applicationLoginAddr": "center.c.haier.net",
        "ownerUserCode": "01436556",
        "ownerUser": "黄超",
        "ownerUserDp": "互联互通平台",
        "ownerUserTel": "18770088119",
        "ownerUserEmail": "HUANGCHAO@HAIER.COM",
        "operationManager": null,
        "operationManagerTel": null,
        "operationManagerEmail": null,
        "createdAt": 1488470400000,
        "updatedAt": 1514995200000
    },
    "code": 0,
    "msg": "请求成功",
    "level": "none",
    "isSuccess": true
}
```
Error Output

```json
{
    "data": null,
    "code": 1,
    "msg": "查询ALM项目具体信息异常",
    "level": "none",
    "isSuccess": false
}
```

#### Proxy API request to Subsystem
Sometime we need to call the subsystem directly. So we can open an API proxy service for it. The API request will send to endpoint of the subsystem.

URI: `{Method} /r/{subsystem_name}/{sub_URI}`

Headers:

```
X-Api-Origin-URI
X-Api-User-ID
```
