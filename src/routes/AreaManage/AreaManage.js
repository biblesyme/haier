import React from 'react'
import { Card, Pagination, Icon, Modal, Button, Form, Input, Table, message } from 'antd';
import New from './New'
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


class AreaManage extends React.Component {
  state = {
    visibleAdd: false,
    page: 1,
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findDomain',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}})
      },
    })
    this.props.selfDispatch({type: 'findDomainAdmin'})
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['8']}})
  }

  showModal = (visible) => {
    return ()=>{
      this.setState({
        [visible]: true,
      });
    }
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
    });
  }

  saveAdd = (values) => {
    let payload = {
      data: {
        ...values,
        type: 'domains',
      },
      successCB: () => {
        this.setState({
          visibleAdd: false,
        });
        this.props.selfDispatch({type: 'findDomainAdmin'})
        this.props.selfDispatch({type: 'findDomain'})
        message.success('领域添加成功')
      },
      failCB: () => {
        this.setState({
          visibleAdd: false,
        });
        message.error('领域添加失败')
      },
    }
    this.props.dispatch({type: 'App/saveRecord', payload})
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const {domains=[], domainAdmins, accounts} = this.props.reduxState
    const activeDomian = domains.filter(d => d.state !== 'removed')
    const items = activeDomian.slice((this.state.page - 1) * 12, this.state.page * 12).map(d => {
      const filterAdmins = domainAdmins.filter(a => a.domainId === d.id)
      return (
        <Item key={d.id}
              resource={d}
              domainAdmins={filterAdmins}
              accounts={accounts}
        />
      )
    })
    return (
      <div>
        <section className="page-section">
          <div className="text-right mg-b10"><Button type="primary" onClick={this.showModal('visibleAdd')}>新建领域</Button></div>
          {items}
          <Pagination className="text-center"
                      current={this.state.page}
                      total={activeDomian.length}
                      onChange={page => this.setState({page})}
                      style={{marginTop: '20px'}}
                      showQuickJumper
                      pageSize={12}
          />
        </section>

        <Modal
          title="领域详情"
          visible={this.state.visibleDetail}
          footer={<Button onClick={this.handleCancel}>返回</Button>}
        >

        </Modal>
        {this.state.visibleAdd && (
          <New
            visible={this.state.visibleAdd}
            onOk={(newData) => {this.saveAdd(newData)}}
            onCancel={this.handleCancel}
            accounts={accounts}
            />
        )}
      </div>
      )
  }
}

AreaManage = Form.create()(AreaManage);
Object.defineProperty(AreaManage, "name", { value: "AreaManage" });
export default connect(require('./model'),['App'])(AreaManage)
