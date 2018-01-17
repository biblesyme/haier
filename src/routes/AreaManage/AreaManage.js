import React from 'react'
import { Card, Pagination, Icon, Modal, Button, Form, Input, Table } from 'antd';
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
  }

  componentWillMount() {
    this.props.selfDispatch({type: 'findDomain'})
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
      <Item key={d.id}
            resource={d}
      />
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

        <Modal
          title="领域详情"
          visible={this.state.visibleDetail}
          footer={<Button onClick={this.handleCancel}>返回</Button>}
        >

        </Modal>
        <New
          visible={this.state.visibleAdd}
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
