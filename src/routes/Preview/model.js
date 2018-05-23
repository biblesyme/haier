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
    resources: [],
  },
  reducers: {
    setState(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    *findProject({payload={}},{call, put}){
      let {callback} = payload
      yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.START} })
      try{
        let projects = yield call([apiStore,apiStore.find], 'project', null, {forceReload: true})
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
        yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.SUCCESS} })
        if(callback){
          yield call(callback)
        }
      }
      catch(e){
        unauth(e)
        yield put({type:'setState',payload: {
            findProjectStatus: LOAD_STATUS.FAIL,
            errorMessage: e.message()
          }
        })
        if(callback){
          yield call(callback)
        }
      }
    },
    *findResource({payload={}},{call, put}){
      let {callback} = payload
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
