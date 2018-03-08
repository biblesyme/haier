import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import {getCookieItem, b64DecodeUnicode} from 'utils/cookies'
import nameMap from 'utils/nameMap'
import { Menu, Icon, Button, Select, Avatar, Badge, Layout, Breadcrumb } from 'antd';
import config from './config'

const SubMenu = Menu.SubMenu;
const {Option} = Select
const {Header, Content, Footer, Sider} = Layout

import styles from './style.sass'

@connect(null,['App'])
export default class MainPage extends React.Component {
  state = {
    collapsed: false,
    findApproval: 'init',
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
    const {user= {},} = this.props.App
    document.cookie = `currentRole=${role};`
    this.props.dispatch({
      type:'App/setState',
      payload: {role, list: false}})
    this.props.dispatch({
      type: 'App/findApproval',
      payload: {
        account: user,
        successCB: () => this.setState({findApproval: 'success'})
      }
    })
  }

  componentWillMount(){
    this.props.init();
    const {user= {},} = this.props.App
    // document.cookie = `csid=9DC093072EEA274D6DE99B6E32C8CBF7;`

    if (user.hasOwnProperty('roles')) {
      document.cookie = `currentRole=${user.roles[0]};`
      this.props.dispatch({type:'App/setState',payload: {role: user.roles[0]}})
    }
    this.props.dispatch({type: 'App/findLocation'})

    if (user.roles.includes('admin') || user.roles.includes('domainAdmin')) {
      this.props.dispatch({
        type: 'App/findApproval',
        payload: {
          account: user,
          successCB: () => this.setState({findApproval: 'success'})
        }
      })
    }
  }
  render() {
    const {user= {}, role} = this.props.App
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{color: 'white'}}
        >
          <div style={{height: '32px', margin: '16px'}} className="text-center">
            海尔产品整合PORTAL
          </div>
          <Menu
            selectedKeys={this.props.App.selectedKeys}
            defaultOpenKeys={['sub0']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            style={{ marginTop: '10px' }}
            onSelect={this.select}
            style={{borderTop: '1px solid #fff'}}
          >
            {['internal', 'manager', 'admin', 'domainAdmin', 'developer'].includes(role) && (
              <Menu.ItemGroup title="资源管理">
                {config.resources.map(r => {
                  if (r.roles.includes(role)) {
                    return (
                      <Menu.Item key={r.key}>
                        <Link to={r.path}>
                          <Icon type={r.icon}></Icon>
                          <span>{r.title}</span>
                        </Link>
                      </Menu.Item>
                    )
                  }
                })}
              </Menu.ItemGroup>
            )}

            {['admin', 'domainAdmin', 'manager'].includes(role) && (
              <Menu.ItemGroup title="审批管理">
                {['admin', 'domainAdmin'].includes(role) && (
                  <Menu.Item key="5">
                    <Link to="/resourcesRequest">
                      <Icon type="approval1"></Icon>
                      <span>
                        {(this.state.findApproval === 'success' && role === 'admin') && (
                          <Badge count={this.props.App.approvals.filter(a => a.state === 'confirmed').length}
                                 offset={this.props.App.approvals.filter(a => a.state === 'confirmed').length > 10 ? [-2, 20] : [-2, 10]}
                          >
                            <span style={{color: 'rgba(255, 255, 255, 0.65)'}}>资源审批</span>
                          </Badge>
                        )}
                        {(this.state.findApproval === 'success' && role === 'domainAdmin') && (
                          <Badge count={this.props.App.approvals.filter(a => a.state === 'pending').length}
                                 offset={this.props.App.approvals.filter(a => a.state === 'pending').length > 10 ? [-2, 15] : [-2, 10]}
                          >
                            <span style={{color: 'rgba(255, 255, 255, 0.65)'}}>资源审批</span>
                          </Badge>
                        )}
                      </span>
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
                  <Link to="/accounts">
                    <span>
                      <Icon type="user" />
                      <span>
                        用户管理
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to="/domain">
                    <Icon type="area"></Icon>
                    <span>领域管理</span>
                  </Link>
                </Menu.Item>
              </Menu.ItemGroup>
            )}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} className={styles["page-header"]}>
             <div className="user-info" style={{float: 'right'}}>
               当前登录： {user.name}
               <Select value={role}
                       onSelect={this.roleChange}
                       style={{marginLeft: '20px'}}
              >
                {user.roles.map(r => <Option key={r}>{nameMap[r]}</Option>)}
              </Select>
              <span className={styles.logout} onClick={this.props.exit} style={{marginRight: '20px'}}><Icon type="logout"></Icon>&nbsp;退出</span>
            </div>
          </Header>
          <Content style={{background: '#ebebeb'}}>
            <div style={{ padding: 24, background: '#ebebeb', minHeight: 360 }} >
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#ebebeb' }}>
            版权所有©️海尔集团
          </Footer>
        </Layout>
      </Layout>
      // <div className={styles["page-wrap"]}>
      //   <div className={styles["page-header"]}>
      //     <div style={{float: "left"}}>
      //       海尔产品整合PORTAL
      //     </div>
      //     <div className="user-info">
      //       当前登录： {user.name}
      //       <Select value={role}
      //               onSelect={this.roleChange}
      //       >
      //         {user.roles.map(r => <Option key={r}>{nameMap[r]}</Option>)}
      //       </Select>
      //       <span className={styles.logout} onClick={this.props.exit}><Icon type="logout"></Icon>&nbsp;退出</span>
      //     </div>
      //   </div>
      //   <div className={styles["page-navigation"]}>
      //       <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16,display:"none" }}>
      //         <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
      //       </Button>
      //   </div>
      //   <div className={styles["page-body"]}>{this.props.children}</div>
      // </div>
    );
  }
}
