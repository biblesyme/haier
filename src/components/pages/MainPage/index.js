import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'

import { Menu, Icon, Button, Select } from 'antd';
const SubMenu = Menu.SubMenu;
const {Option} = Select

import styles from './style.sass'

class MainPage extends React.Component {
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentWillMount(){
    this.props.init();
  }
  render() {
    const role = this.props.App.role

    return (
      <div className={styles["page-wrap"]}>
        <div className={styles["page-header"]}>
          <div style={{float: "left"}}>
            海尔产品整合PORTAL
          </div>
          <div className="user-info">
            当前登录： 张三
            <Select defaultValue="管理员"
                    value={role}
                    onChange={role => this.props.dispatch({type:'App/setState',payload: {role}})}
            >
              <Option key="admin">管理员</Option>
              <Option key="domainAdmin">团队长</Option>
              <Option key="manager">项目经理</Option>
              <Option key="developer">开发者</Option>
              <Option key="internal">非A账号</Option>
              <Option key="external">A账号</Option>
            </Select>
            <span className="mg-l10" onClick={this.props.exit}><Icon type="logout"></Icon>&nbsp;退出</span>
          </div>
        </div>
        <div className={styles["page-navigation"]}>
            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16,display:"none" }}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub0']}
              mode="inline"
              theme="light"
              inlineCollapsed={this.state.collapsed}
            >
              {['admin', 'domainAdmin', 'manager'].includes(role) && (
                <Menu.ItemGroup title="审批管理">
                  {['admin', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="1"><Link to="/resourcesRequest">资源审批</Link></Menu.Item>
                  )}
                  {['manager'].includes(role) && (
                    <Menu.Item key="2"><Link to="/resourcesRequest/permissionsRequest">我发起的审批</Link></Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}

              {['internal', 'manager', 'admin', 'domainAdmin', 'developer'].includes(role) && (
                <Menu.ItemGroup title="资源管理">
                  {['internal', 'manager', 'admin', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="5"><Link to="/">应用创建</Link></Menu.Item>
                  )}
                  {['admin'].includes(role) && (
                    <Menu.Item key="6">
                      <Link to="/information">
                        <span>
                          <Icon type="mail" />
                          <span>
                            信息中心
                          </span>
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['developer', 'manager', 'admin', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="7">
                      <Link to="/application">
                        <span>
                          <Icon type="appstore" />
                          <span>应用列表</span>
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['admin'].includes(role) && (
                    <Menu.Item key="8"><Link to="/resource">资源列表</Link></Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}

              {role === 'admin' && (
                <Menu.ItemGroup title="权限管理">
                  <Menu.Item key="9">
                    <Link to="/user">
                      <span>
                        <Icon type="user" />
                        <span>
                          用户管理
                        </span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="10"><Link to="/areamanage">领域管理</Link></Menu.Item>
                </Menu.ItemGroup>
              )}
            </Menu>
        </div>
        <div className={styles["page-body"]}>{this.props.children}</div>
      </div>
    );
  }
}
export default connect(null,['App'])(MainPage)
