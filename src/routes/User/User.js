import React from 'react'
import { Tabs, Select } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

import List from './List'
import renderRoutes from 'utils/renderRoutes'

class C extends React.Component {
  state = {
    tabPosition: 'top',
  }
  onTabClick(route){
    return ()=>{
      this.props.router.history.push(route)
    }
  }
  render() {
    return (
      <div className="page-section">
        {renderRoutes(this.props.route.routes, {app: this.props.app})}
      </div>
    );
  }
}

export default C
