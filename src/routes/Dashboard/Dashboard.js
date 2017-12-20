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
        hhh
      </div>
    );
  }
}
export default NavMenu