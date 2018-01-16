import React from 'react'
import { Card, Pagination, Icon, Modal, Button, Form, Input, Table } from 'antd';
import New from './New'
import Edit from './Edit'
import Item from './Item'

const FormItem = Form.Item;

import { connect } from 'utils/ecos'

import styles from "./style.sass"

function onSelect(suggestion) {
  console.log('onSelect', suggestion);
}


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

const columns = [{
  title: '序号',
  dataIndex: 'key',
}, {
  title: 'Portal账号',
  dataIndex: 'portal',
}, {
  title: '姓名',
  dataIndex: 'name',
}];
const data = [{
  key: '1',
  name: '张三',
  portal: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: '张三',
  portal: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: '张三',
  portal: 32,
  address: 'Sidney No. 1 Lake Park',
}];

class AreaManage extends React.Component {
  state = { visibleAdd: false, visibleEdit: false, visibleDetail: false, }

  componentWillMount() {
    this.props.selfDispatch({type: 'findDomain'})
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
  onChange(pageNumber) {
    console.log('Page: ', pageNumber);
  }

  saveAdd = (values) => {
    let payload = {
      ...values,
      type: 'domains',
    }
    this.props.selfDispatch({type: 'saveDomain', payload})
    this.setState({
      visibleAdd: false,
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const {reduxState} = this.props

    const domains = reduxState.domains.map(d => (
      <div key={d.id} className="inline-block mg-lr10 mg-b10">
        <Card className={styles["area-card"]}
              title={d.name}
              extra={<Icon type="edit" onClick={this.showModal('visibleEdit')} style={{cursor: 'pointer'}}/>}
              style={{ width: 300 }}
        >
          <h4 className="pull-left">团队长：</h4>
          <div className="inline-block pd-l10">
            <p>张三 012349</p>
            <p>张三 012349</p>
            <p>张三 012349</p>
          </div>
          <div><Icon onClick={this.showModal('visibleDetail')} className="pull-right" type="ellipsis" /></div>
        </Card>
      </div>
    ))
    return (
      <div>
        <section className="page-section">
          <div className="text-right mg-b10"><Button type="primary" onClick={this.showModal('visibleAdd')}>新建领域</Button></div>
          {domains}
        </section>
        <div style={{paddingBottom: '60px'}}></div>
        <section className="page-section bottom-actions text-center">
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
        </section>

        {/* <Modal
          title="修改领域"
          visible={this.state.visibleEdit}
          okText="添加"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >

        </Modal> */}

        <Modal
          title="领域详情"
          visible={this.state.visibleDetail}
          footer={<Button onClick={this.handleCancel}>返回</Button>}
        >
          <p><label for="">当前领域：</label><span>供应链</span></p>
          <h3>团队长：</h3>
          <Table pagination={false} columns={columns} dataSource={data} size="small" />
          <div className="mg-b10"></div>
          <div className="text-center"><Pagination showQuickJumper defaultCurrent={2} total={100} onChange={this.onChange} /></div>
        </Modal>
        <New
          visible={this.state.visibleAdd}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          />
        <Edit
          visible={this.state.visibleEdit}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          />
      </div>
      )
  }
}

AreaManage = Form.create()(AreaManage);
Object.defineProperty(AreaManage, "name", { value: "AreaManage" });
export default connect(require('./model'))(AreaManage)
