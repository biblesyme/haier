import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'
import unauth from 'utils/unauth'

export default {
  state: {
    findApprovalStatus: LOAD_STATUS.INITIAL,
		findAccountStatus: LOAD_STATUS.INITIAL,
		findProjectStatus: LOAD_STATUS.INITIAL,
    approvals: [],
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
		*findApproval({payload={}},{call, put}){
      let {callback, account} = payload
			try{
				let approval = yield call([account,account.followLink], 'requests')
				yield put({type:'setState',payload: {approvals: approval.content}})
        if(callback){
          yield call(callback)
        }
			} catch(e) {
        unauth(e)
        if(callback){
          yield call(callback)
        }
			}
		},
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
          }
        })
      }
    },
    *findProject({payload},{call, put}){
      yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.START} })
      try{
        let projects = yield call([apiStore,apiStore.find], 'project', null, {forceReload: true})
        let fomatProjects = yield projects.content.map(p => {
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
        yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.SUCCESS} })
      }
      catch(e){
        unauth(e)
        yield put({type:'setState',payload: {
            findProjectStatus: LOAD_STATUS.FAIL,
            errorMessage: e.message()
          }
        })
      }
    },
    *findResource({payload={}},{call, put}){
      let {callback} = payload
      yield put({type:'setState',payload: {findResourceStatus: LOAD_STATUS.START} })
      try{
        let resources = yield call([apiStore,apiStore.find], 'resource', null, {forceReload: true})
        let fomatResources = yield resources.content.map(r => {
          if (r.hasOwnProperty('data')) {
            return {
              ...r,
              data: JSON.parse(r.data),
            }
          } else {
            return r
          }
        })
        yield put({type:'setState',payload: {resources: fomatResources}})
        yield put({type:'setState',payload: {findResourceStatus: LOAD_STATUS.SUCCESS} })
        if(callback){
          yield call(callback)
        }
      }
      catch(e){
        unauth(e)
        yield put({type:'setState',payload: {
            findResourceStatus: LOAD_STATUS.FAIL,
          }
        })
        if(callback){
          yield call(callback)
        }
      }
    },
  }
}
