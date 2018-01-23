import { Table, Icon, Pagination, Tag, Modal, Form, Input, Button, Select, Row, Col } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect as modelConnect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import Edit from './Edit'

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

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class Application extends React.Component {
  state = {
    visibleAdd: false,
    visibleEdit: false,
    visibleDetail: false,
    domainSelect: 'all',
    filter: null,
    record: {},
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

  detail = (record) => {
    this.props.history.push({pathname: `/applications/${record.id}`, record})
  }

  deleteMember = (e, accout) => {
    let newMembers = this.state.members.filter(m => m.accout !== accout)
    this.setState({
      members: newMembers,
    })
  }

  render(){
    const {projects=[], accounts=[]} = this.props.reduxState
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
      title: <div className="text-center">操作</div>,
      render: (record, index) => {
        return (
          <div className="text-center">
            <a onClick={() => this.detail(record)}>申请资源</a>
            <a className="mg-l10" onClick={() => this.detail(record)}>查看详情</a>
            <a className="mg-l10"
               onClick={() => this.setState({visibleEdit: true, record})}
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

    const boxes = projects.filter(a => {
      const {filter} = this.state
      if (!filter) {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [a.name || '', a.externalId || ''].join()
      return reg.test(fieldsToFilter)
    })

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

      {/* <Modal
        title="成员管理"
        visible={this.state.visibleEdit}
        okText="提交"
        cancelText="取消"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
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
      </Modal> */}
      {this.state.visibleEdit && (
        <Edit
          visible={this.state.visibleEdit}
          onOk={(newData) => {this.updateDomain(newData)}}
          onCancel={this.handleCancel}
          resource={this.state.record}
          accounts={accounts}
          />
      )}

    </div>
      )
  }
}
Object.defineProperty(Application, "name", { value: "Application" });
export default modelConnect(require('./model'), ['App'])(Application)
