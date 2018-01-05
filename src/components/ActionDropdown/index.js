import React from 'react'
import {Menu, Dropdown, Button, Icon, Modal} from 'antd'
import styles from './styles.scss'

class C extends React.Component {

  render() {
    let {actions, cbMap, resource, component, onClick} = this.props
    actions = actions.filter(a => a.enabled || a.divider)

    const items = actions.map((action, i) => {
      return action.divider ? <Menu.Divider key={i} /> :
      (
        <Menu.Item disabled={action.enabled === false} key={action.key}>
          <div className={styles.actionItem}>
            <span >{action.label}</span>
            {action.icon ? <Icon {...(action.icon || {})}></Icon> : null}
          </div>
        </Menu.Item>
      )
    })

    const handleClick = e => {
      const action = actions.find(action => action.key === e.key)
      if (typeof this.props.onClick === 'function') {
       onClick(action, e)
      }

      cbMap = cbMap || component.actions
      if (cbMap && typeof cbMap[action.key] === 'function') {

        let defaultConfig = {
          width: 800,
          style: {
            top: 0,
          }
        }
        const {popConfirm} = action
        if (popConfirm) {
          if (action.key === 'delete' || action.key === 'remove') {
            defaultConfig = {
              ...defaultConfig,
              title: '确定要删除么 ?',
              content: resource.name || resource.id,
            }
          }
          Modal.confirm({
            ...defaultConfig,
            ...(typeof action.popConfirm === 'object' ? popConfirm : {}),
            onOk: () => cbMap[action.key].bind(component)(resource, action),
          })
        } else {
          cbMap[action.key].bind(component)(resource, action)
        }
      }
    }

    const menu = (
      <Menu onClick={handleClick}>
        {items}
      </Menu>
    )

    return (
      <Dropdown placement="bottomRight" trigger={['click']} overlay={menu}>
        <div style={{width: '100%', height: '100%', textAlign: 'center'}}>
          <Button size="small" type="text"><Icon type="down" /></Button>
        </div>
      </Dropdown>
    )
  }
}

export default C
