import { Table, Icon, Pagination, Tag, Modal, Form, Input, Button, Select, Row, Col } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect as modelConnect } from 'utils/ecos'
import nameMap from 'utils/nameMap'

import styles from './styles.scss'

const FormItem = Form.Item
const {Search} = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  style: {
    marginBottom: '10px'
  }
};



const data = [{
  key: '1',
  name: '大数据',
  manager: '张三',
  health: '50%',
  resourceUsage: '30%',
  middleWareHealth: '75% 80% 60%',
  status: '待部署',
  actions: '查看详情'
}];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class Application extends React.Component {
  state = {
    visibleAdd: false,
    visibleEdit: false,
    visibleDetail: false,
    members: [{
      key: '1',
      name: '大数据',
      manager: '张三',
      health: '50%',
      resourceUsage: '30%',
      middleWareHealth: '75% 80% 60%',
      status: '待部署',
      actions: '查看详情'
    }],
    domainSelect: 'all',
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findProject',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}})
      }
    })
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['3']}})
  }

  showModal = (visible) => {
    return ()=>{this.setState({
      [visible]: true,
    });
  }
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }

  deleteMember = (e, accout) => {
    let newMembers = this.state.members.filter(m => m.accout !== accout)
    this.setState({
      members: newMembers,
    })
  }

  render(){
    const {projects=[],} = this.props.reduxState
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '应用名称',
      dataIndex: 'name',
      // sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: '项目经理',
      dataIndex: 'data.data.ownerUser',
      // sorter: (a, b) => a.manager.length - b.manager.length,
    }, {
      title: '应用告警数',
      dataIndex: 'health',
    }, {
      title: '资源占用率',
      dataIndex: 'resourceUsage1',
    }, {
      title: '资源种类',
      dataIndex: 'resourceUsage',
      // render() {
      //   return (
      //     <div>
      //       <Tag>M</Tag>
      //       <Tag>P</Tag>
      //       <Tag>R</Tag>
      //       <Tag>MQ</Tag>
      //     </div>
      //   )
      // }
    },
    {
      title: '状态',
      render: (record) => <span>{nameMap[record.state]}</span>
    }, {
      title: '操作',
      render: (record, index) => {
        return (
          <div>
            {/* <Link to={`/resourcesRequest`}>申请资源</Link> */}
            <Link className="mg-l10" to={`/applications/${record.id}`} key={record.id}>查看详情</Link>
            <a className="mg-l10"
               onClick={this.showModal('visibleEdit')}
            >成员管理</a>
          </div>
        )
      }
    }];

    // const members = this.state.members.map(m => {
    //   return (
    //     <p key={m.accout}>
    //       {`${m.name} ${m.accout}`}
    //       <Icon className="mg-l10"
    //             type="delete"
    //             style={{cursor: 'pointer'}}
    //             onClick={e => this.deleteMember(e, m.accout)}
    //       />
    //     </p>
    //   )
    // })

    const boxes = projects

    return (
    <div>
      <div className="page-section">
        <h3>应用列表</h3>
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            <Select style={{ width: 200 }}
                    value={this.state.domainSelect}
                    onChange={domainSelect => this.setState({domainSelect})}
            >
              <Option key="all">全部</Option>
              <Option key="PSI">PSI</Option>
              <Option key="众创汇">众创汇</Option>
            </Select>
          </Col>
          <Col>
            <Search
              placeholder="请输入您搜索的关键词"
              style={{ width: 200 }}
              onChange={e => this.setState({filter: e.target.value})}
            />
          </Col>
        </Row>
        <Table pagination={{showQuickJumper: true}} columns={columns} dataSource={boxes} rowKey="id"/>
      </div>

      <Modal
        title="成员管理"
        visible={this.state.visibleEdit}
        okText="提交"
        cancelText="取消"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        // destroyOnClose={true}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="当前应用"
          >
            大数据
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="成员"
          >
            {/* {members} */}
          </FormItem>
        </Form>
        <h3>查询</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="账号"
          >

              <Search />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户信息"
          >
            <p>张三  12123124231</p>
          </FormItem>
        </Form>
      </Modal>
    </div>
      )
  }
}
Object.defineProperty(Application, "name", { value: "Application" });
export default modelConnect(require('./model'), ['App'])(Application)
