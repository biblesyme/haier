import React from 'react'
import { Tabs, Select } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

import IndexPage from './routes/IndexPage/IndexPage'
import renderRoutes from 'react-router-config/renderRoutes'

class ResourcesRequest extends React.Component {
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
        
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}

export default ResourcesRequest