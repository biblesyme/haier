import React from 'react'
import {Card, Icon} from 'antd'

import styles from "./style.sass"

export default class C extends React.Component {
  render() {
    return (
      <main>
        <div className="inline-block mg-lr10 mg-b10">
          <Card className={styles["area-card"]}
                // title={d.name}
                // extra={<Icon type="edit" onClick={this.showModal('visibleEdit')} style={{cursor: 'pointer'}}/>}
                style={{ width: 300 }}
          >
            <h4 className="pull-left">团队长：</h4>
            <div className="inline-block pd-l10">
              <p>张三 012349</p>
              <p>张三 012349</p>
              <p>张三 012349</p>
            </div>
            {/* <div><Icon onClick={this.showModal('visibleDetail')} className="pull-right" type="ellipsis" /></div> */}
          </Card>
        </div>
      </main>
    )
  }
}
