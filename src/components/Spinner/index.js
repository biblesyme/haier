import React from 'react'
import {Spin} from 'antd'

import styles from './styles.scss'

class C extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // ongoing http request count
      count: 0,
      dots: 1,
    }
  }
  updateCount(n) {
    const count = this.state.count + n
    this.props.updateLoading(count !== 0)
    this.setState({count})
  }
  componentWillMount() {
    // intercept all http requsts made via the http instance

  }

  componentDidMount(){

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <main className={[styles.root, this.state.count > 0 ? styles.show : ''].join(' ')}>
        <div className={styles.spinner}></div>
        <div className={[styles.loaddingText, 'text-link pt-10 f-md'].join(' ')}>
          加载中<span>{'.'.repeat(this.state.dots)}</span>
        </div>
      </main>
    )
  }
}

export default C
