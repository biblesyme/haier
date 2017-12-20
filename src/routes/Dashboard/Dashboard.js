import React from 'react'
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;

import styles from './style.sass'

class NavMenu extends React.Component {
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <div className="page-wrap">
        <div className="page-header">
          <div style={{float: "left"}}>
            海尔产品整合PORTAL
          </div>
          <div className="user-info">
            当前登录： 张三 项目经理
          </div>
        </div>
        <div className="page-navigation">
            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16,display:"none" }}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub0']}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
            >
              <SubMenu key="sub0" title={<span><Icon type="mail" /><span>审批管理</span></span>}>
                <Menu.Item key="1">资源审批</Menu.Item>
                <Menu.Item key="2">权限审批</Menu.Item>
              </SubMenu>
              <SubMenu key="sub1" title={<span><Icon type="mail" /><span>资源管理</span></span>}>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>全局资源</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
        </div>
        <div className="page-body"></div>
      </div>
    );
  }
}
export default NavMenu