import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'

import { Menu, Icon, Button, Select } from 'antd';
const SubMenu = Menu.SubMenu;
const {Option} = Select

import styles from './style.sass'

@connect(null,['App'])
export default class MainPage extends React.Component {
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  select = ({key}) => {
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: [key]}})
  }

  roleChange = (role) => {
    document.cookie = `currentRole=${role};`
    this.props.dispatch({type:'App/setState',payload: {role}})
  }

  componentWillMount(){
    this.props.init();
    const {user= {},} = this.props.App
    document.cookie = `csid=9DC093072EEA274D6DE99B6E32C8CBF7;`
    if (user.hasOwnProperty('roles')) {
      document.cookie = `currentRole=${user.roles[0]};`
      this.props.dispatch({type:'App/setState',payload: {role: user.roles[0]}})
    }
    // this.props.dispatch({type: 'App/findDomain'})
  }
  render() {
    const {user= {}, role} = this.props.App
    return (
      <div className={styles["page-wrap"]}>
        <div className={styles["page-header"]}>
          <div style={{float: "left"}}>
            海尔产品整合PORTAL
          </div>
          <div className="user-info">
            当前登录： {user.name}
            <Select defaultValue="管理员"
                    value={role}
                    onSelect={this.roleChange}
            >
              <Option key="admin">管理员</Option>
              <Option key="domainAdmin">团队长</Option>
              <Option key="manager">项目经理</Option>
              <Option key="developer">开发者</Option>
              <Option key="internal">非A账号</Option>
              <Option key="external">A账号</Option>
            </Select>
            <span className={styles.logout} onClick={this.props.exit}><Icon type="logout"></Icon>&nbsp;退出</span>
          </div>
        </div>
        <div className={styles["page-navigation"]}>
            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16,display:"none" }}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
            <Menu
              selectedKeys={this.props.App.selectedKeys}
              defaultOpenKeys={['sub0']}
              mode="inline"
              theme="light"
              inlineCollapsed={this.state.collapsed}
              style={{ marginTop: '10px' }}
              onSelect={this.select}
            >
              {['internal', 'manager', 'admin', 'domainAdmin', 'developer'].includes(role) && (
                <Menu.ItemGroup title="资源管理">
                  {['internal', 'manager', 'admin', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="1">
                      <Link to="/">
                        <Icon type="app"></Icon>
                        <span>应用创建</span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['admin'].includes(role) && (
                    <Menu.Item key="2">
                      <Link to="/information">
                        <span>
                          <Icon type="desktop" />
                          <span>
                            信息中心
                          </span>
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['developer', 'manager', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="3">
                      <Link to="/application">
                        <span>
                          <Icon type="appstore" />
                          <span>应用列表</span>
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['admin'].includes(role) && (
                    <Menu.Item key="4">
                      <Link to="/resource">
                        <Icon type="resource"></Icon>
                        <span>资源列表</span>
                      </Link>
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}

              {['admin', 'domainAdmin', 'manager'].includes(role) && (
                <Menu.ItemGroup title="审批管理">
                  {['admin', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="5">
                      <Link to="/resourcesRequest">
                        <Icon type="approval1"></Icon>
                        <span>资源审批</span>
                      </Link>
                    </Menu.Item>
                  )}
                  {['admin', 'manager', 'domainAdmin'].includes(role) && (
                    <Menu.Item key="6">
                      <Link to="/resourcesRequest/permissionsRequest">
                        <Icon type="SubmitReview"></Icon>
                        <span>我发起的审批</span>
                      </Link>
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}



              {role === 'admin' && (
                <Menu.ItemGroup title="权限管理">
                  <Menu.Item key="7">
                    <Link to="/user">
                      <span>
                        <Icon type="user" />
                        <span>
                          用户管理
                        </span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <Link to="/areamanage">
                      <Icon type="area"></Icon>
                      <span>领域管理</span>
                    </Link>
                  </Menu.Item>
                </Menu.ItemGroup>
              )}
            </Menu>
        </div>
        <div className={styles["page-body"]}>{this.props.children}</div>
      </div>
    );
  }
}
