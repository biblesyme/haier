import React from 'react'
import { Circle, Line } from 'rc-progress';
import styles from './styles.scss'

class C extends React.Component {
  render() {
    let {percent, width} = this.props
    let colorMap = {
      green: '#389e0d',
      orange: '#faad14',
      red: '#f5222d',
    }
    let color = colorMap.green
    if (percent >= 75) {
      color = colorMap.orange
    }
    if (percent >= 90) {
      color = colorMap.red
    }
    return (
      <div className="ant-progress ant-progress-circle ant-progress-status-normal ant-progress-show-info ant-progress-default">
        <div className="ant-progress-inner">
          <Circle percent={percent}
                  strokeColor={color}
                  strokeWidth="6"
                  trailWidth="6"
                  gapPosition="bottom"
                  gapDegree="75"
                  style={{width}}
          />
          <span className="ant-progress-text">{percent}%</span>
        </div>
      </div>
    )
  }
}

export default C
