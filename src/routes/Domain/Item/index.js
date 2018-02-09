import React from 'react'
import {Card, Icon, Tooltip} from 'antd'
import Edit from './Edit'
import Detail from './Detail'
import { connect } from 'utils/ecos'

import styles from "./style.sass"

class Item extends React.Component {
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

  updateDomain = (values) => {
    let payload = {
      ...values,
      type: 'domain',
    }
    this.props.dispatch({type: 'AreaManage/updateDomain', payload, resource: this.props.resource})
    this.setState({
      visibleEdit: false,
    });
  }



  render() {
    const {accounts=[], resource} = this.props
    const domainAdmins = this.props.domainAdmins.map(domainAdmin => {
      return (
        <p key={domainAdmin.id}>{`${domainAdmin.account.name} ${domainAdmin.account.externalId}`}</p>
      )
    })

    return (
      <div className="inline-block mg-lr10 mg-b10">
        <Card className={styles["area-card"]}
              title={resource.name}
              extra={<Tooltip title="修改"><Icon type="edit" onClick={this.showModal('visibleEdit')} style={{cursor: 'pointer'}}/></Tooltip> }
              style={{ width: 300, height: 200 }}
        >

          <h4 className="pull-left">团队长：</h4>
          <div className="inline-block pd-l10" style={{height: '130px'}}>
            {domainAdmins.length > 0 && domainAdmins}
          </div>
          {domainAdmins.length > 0 && (
            <div>
             <Tooltip title="详情">
               <Icon onClick={this.showModal('visibleDetail')}
                        className="pull-right"
                        type="ellipsis"
                        style={{cursor: 'pointer'}}
                   />
             </Tooltip>
            </div>
          )}

        </Card>

        {this.state.visibleEdit && (
          <Edit
            visible={this.state.visibleEdit}
            onOk={(newData) => {this.updateDomain(newData)}}
            onCancel={this.handleCancel}
            resource={resource}
            domainAdmins={this.props.domainAdmins}
            accounts={accounts}
            />
        )}

      {this.state.visibleDetail && (
        <Detail
          key={resource.id}
          visible={this.state.visibleDetail}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          resource={resource}
          domainAdmins={this.props.domainAdmins}
          />
      )}
      </div>
    )
  }
}

export default connect(null,['AreaManage'])(Item)
