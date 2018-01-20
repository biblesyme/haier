import React from 'react'
import {Table, Row, Col, Input, Button, Select} from 'antd'
import Detail from './Detail'
import { connect } from 'utils/ecos'

const {Search} = Input
const {Option} = Select

import styles from './styles.scss'

const datas =[{
  id: 1,
  type: '中间件',
  resource: 'MySQL',
  application: 'PSI用户大屏',
  description: 'poi',
  state: '已驳回',
  action: '查看',
},]

class MySubmit extends React.Component {
  state = {
    filteredInfo: null,
    visibleDetail: false,
    record: {},
    filter: null,
    Selected: 'all',
  };

  componentWillMount() {
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['6']}})
  }

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
    });
  }

  render() {
    let { filteredInfo, } = this.state;
    const boxes = datas.filter(d => {
      const {filter} = this.state
      if (!filter || filter === 'all') {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [d.state || '',].join()
      return reg.test(fieldsToFilter)
    })
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '全部', value: 'all' },
        { text: '中间件', value: '中间件' },
        { text: 'PAAS', value: 'paas' },
        { text: '能力开放平台', value: 'Platform' },
      ],
      onFilter: (value, record) => {
        if (value === 'all') {
          return record.type
        }
        return record.type.includes(value)
      },
      filterMultiple: false,
    }, {
      title: '资源信息',
      dataIndex: 'resource',
      key: 'resource',
    }, {
      title: '所属应用',
      dataIndex: 'application',
      key: 'application',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action, record) => {
        return (
          <div>
            <a onClick={e => this.setState({visibleDetail: true, record})}>{action}</a>
          </div>
        )
      }
    },];
    return (
      <main className="page-section">
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            <Select style={{width: '200px'}}
                    value={this.state.Selected}
                    onChange={Selected => this.setState({Selected, filter: Selected,})}
            >
              <Option key="all">全部</Option>
              <Option key="待审批">待审批</Option>
              <Option key="已审批">已审批</Option>
              <Option key="已驳回">已驳回</Option>
            </Select>
          </Col>
        </Row>
        <Row>
        <Col>
          <Table
            dataSource={boxes}
            columns={columns}
            rowKey="id"
          />
        </Col>
      </Row>
      <Detail
        visible={this.state.visibleDetail}
        onOk={(newData) => {this.saveAdd(newData)}}
        onCancel={this.handleCancel}
        resource={this.state.record}
        />
    </main>
    )
  }
}

Object.defineProperty(MySubmit, "name", { value: "MySubmit" });
export default connect(null,['App'])(MySubmit)
