import { Mention } from 'antd';
const { toString, toEditorState } = Mention;
import React from 'react'

import { connect } from 'utils/ecos'


function onSelect(suggestion) {
  console.log('onSelect', suggestion);
}

let MentionBox = ({dispatch,reduxState}) =>(
  <input type="text" value={reduxState} onChange={(e)=>{
      dispatch({
        type: 'setText'
        ,payload: e.target.value
      })
    }}/>
)

export default connect(require('./model'))(MentionBox)