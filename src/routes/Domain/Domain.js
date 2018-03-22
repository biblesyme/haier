import React from 'react'
import { Card, Pagination, Icon, Modal, Button, Form, Input, Table, message, Row, Col } from 'antd';
import New from './New'
import Item from './Item'

const FormItem = Form.Item;

import { connect } from 'utils/ecos'

import styles from "./style.sass"

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
    this.setState({
      visibleAdd: false,
     });
   }
   handleCancel = (e) => {
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
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 30}}>
            <h3>领域列表</h3>
            <Button type="primary" onClick={this.showModal('visibleAdd')} icon="plus">新建领域</Button>
          </div>
          {items}
          <Row type="flex" justify="end">
            <Col>
              <Pagination current={this.state.page}
                          total={activeDomian.length}
                          onChange={page => this.setState({page})}
                          style={{marginTop: '20px'}}
                          showQuickJumper
                          pageSize={12}
              />
            </Col>
          </Row>
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
