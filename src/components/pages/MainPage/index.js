import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import {getCookieItem, b64DecodeUnicode} from 'utils/cookies'
import nameMap from 'utils/nameMap'
import { Menu, Icon, Button, Select, Avatar, Badge, Layout, Divider } from 'antd';
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
    localStorage.setItem('role', role)
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
    if (user.hasOwnProperty('roles') && !localStorage.getItem('role')) {
      document.cookie = `currentRole=${user.roles[0]};`
      this.props.dispatch({type:'App/setState',payload: {role: user.roles[0]}})
    } else {
      const role = localStorage.getItem('role')
      document.cookie = `currentRole=${role};`
      this.props.dispatch({type:'App/setState',payload: {role: role}})
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
        <Sider style={{color: 'white'}} width="215"
        >
          <div style={{height: '50px', padding: '18px 35px 18px 36px'}} >
           <span>海尔产品整合PORTAL</span>
          </div>
          <Menu
            selectedKeys={this.props.App.selectedKeys}
            defaultOpenKeys={['sub0']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            style={{ marginTop: '10px' }}
            onSelect={this.select}
            style={{borderTop: '1px solid #374353'}}
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
          <Header style={{ background: '#fff', padding: 0, height: 50 }} className={styles["page-header"]}>
             <div  style={{float: 'right', height: 50, display: 'flex', alignItems: 'center'}}
                  //  className="user-info"
             >
               <span className={styles['user']}>当前登录: {user.name}</span>
               <Divider type="vertical" style={{marginLeft: 20, marginRight: 20}}/>
               <Select value={role}
                       onSelect={this.roleChange}
                       className={styles['user_select']}
              >
                {user.roles.map(r => <Option key={r}>{nameMap[r]}</Option>)}
              </Select>
              <Divider type="vertical" style={{marginLeft: 20, marginRight: 20}}/>
              <span className={styles.logout} onClick={this.props.exit} style={{margin: '19px 30px 19px 0px'}}><Icon type="logout"></Icon>&nbsp;退出</span>
            </div>
          </Header>
          <Content style={{background: '#ebebeb'}}>
            <div style={{ padding: '24px 20px', background: '#ebebeb', minHeight: 360 }} >
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#ebebeb' }}>
            版权所有©️海尔集团
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
