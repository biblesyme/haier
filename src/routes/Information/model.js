import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'
import unauth from 'utils/unauth'

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
    *findAccount({payload},{call, put}){
      yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.START} })
      try{
        let accounts = yield call([apiStore,apiStore.find], 'account', null, {forceReload: true})
        yield put({type:'setState',payload: {accounts: accounts.content}})
        yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.SUCCESS} })
      }
      catch(e){
        unauth(e)
        yield put({type:'setState',payload: {
            findAccountStatus: LOAD_STATUS.FAIL,
            errorMessage: e.message()
          }
        })
      }
    },
    *findProject({payload={}}, {call, put}) {
      let {callback, account} = payload
      try {
        let projects = yield call([account,account.followLink], 'projects')
        let fomatProjects = projects.content.map(p => {
          if (p.hasOwnProperty('data')) {
            return {
              ...p,
              data: JSON.parse(p.data),
            }
          } else {
            return p
          }
        })
        yield put({type:'setState',payload: {projects: fomatProjects}})
        if(callback){
          yield call(callback)
        }
      } catch(e) {
        unauth(e)
        if(callback){
          yield call(callback)
        }
      }
    }
  }
}
