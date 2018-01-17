import React from 'react'
import {Card, Icon} from 'antd'
import Edit from './Edit'
import Detail from './Detail'

import styles from "./style.sass"

export default class C extends React.Component {
  state = {
    visibleEdit: false,
    visibleDetail: false,
  }

  showModal = (visible) => {
    return ()=>{
      this.setState({
        [visible]: true,
      });
    }
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visibleEdit: false,
      visibleDetail: false,
    });
  }

  render() {
    const {resource} = this.props
    return (
      <div className="inline-block mg-lr10 mg-b10">
        <Card className={styles["area-card"]}
              title={resource.name}
              extra={<Icon type="edit" onClick={this.showModal('visibleEdit')} style={{cursor: 'pointer'}}/>}
              style={{ width: 300 }}
        >
          <h4 className="pull-left">团队长：</h4>
          <div className="inline-block pd-l10">
            <p>张三 012349</p>
            <p>张三 012349</p>
            <p>张三 012349</p>
          </div>
          <div><Icon onClick={this.showModal('visibleDetail')} className="pull-right" type="ellipsis" style={{cursor: 'pointer'}}/></div>
        </Card>
        <Edit
          visible={this.state.visibleEdit}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          resource={resource}
          />
        <Detail
          visible={this.state.visibleDetail}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          resource={resource}
          />
      </div>
    )
  }
}
