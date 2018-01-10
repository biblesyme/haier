import React from 'react'
import { Link } from 'react-router-dom'
import {Button} from 'antd'

import styles from './index.scss'

export default class C extends React.Component {
  render() {
    return (
      <div className={[styles.excetion].join(' ')}>
        <div className={styles.imgBlock}>
          <div className={styles.imgEle} style={{backgroundImage: `url(/static/exception.svg)`}}></div>
        </div>
        <div className={styles.content}>
          <h1>403</h1>
          <div className={styles.desc}>
            抱歉，你无权访问该页面
          </div>
          <div className={styles.actions}>
            <Link to='/'><Button type="primary">返回首页</Button></Link>
          </div>
        </div>
      </div>
    )
  }
}
