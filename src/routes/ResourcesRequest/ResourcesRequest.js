import React from 'react'
import { Tabs, Select } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

import IndexPage from './routes/IndexPage/IndexPage'
class ResourcesRequest extends React.Component {
  state = {
    tabPosition: 'top',
  }
  onTabClick(route){
    return ()=>{
      debugger
      this.props.router.history.push(route)
    }
  }
  render() {
    debugger
    return (
      <div className="page-section">
        <Tabs tabPosition={this.state.tabPosition}>
          <TabPane onTabClick={this.onTabClick('/resourcesRequest')} tab="资源申请" key="1"><IndexPage></IndexPage></TabPane>
          <TabPane onTabClick={this.onTabClick('/resourcesRequest/permissionsRequest')} tab="权限申请" key="2">{this.props.children}</TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ResourcesRequest