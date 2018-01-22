import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'

export default {
  state: {
		findAccountStatus: LOAD_STATUS.INITIAL,
		findProjectStatus: LOAD_STATUS.INITIAL,
		accounts: [],
    projects: [],
  },
  reducers: {
    setText(state,action){
      return action.payload
    },
    setState(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
  }
}
