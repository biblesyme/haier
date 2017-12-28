import { delay } from 'redux-saga'
export default {
  state: '',
  reducers: {
    setText(state,action){
      return action.payload
    }
  }
}