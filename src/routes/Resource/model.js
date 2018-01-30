import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'

export default {
  state: {
    findResourcelStatus: LOAD_STATUS.INITIAL,
		findProjectStatus: LOAD_STATUS.INITIAL,
		resources: [],
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
		*findResource({payload={}},{call, put}){
      let {callback} = payload
			yield put({type:'setState',payload: {findResourceStatus: LOAD_STATUS.START} })
			try{
				let resources = yield call([apiStore,apiStore.find], 'resource', null, {forceReload: true})
        let fomatResources = yield resources.content.map(r => {
          return {
            ...r,
            data: JSON.parse(r.data),
          }
        })
				yield put({type:'setState',payload: {resources: fomatResources}})
				yield put({type:'setState',payload: {findResourcelStatus: LOAD_STATUS.SUCCESS} })
        if(callback){
          yield call(callback)
        }
			}
			catch(e){
				yield put({type:'setState',payload: {
						findResourceStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
        if(callback){
          yield call(callback)
        }
			}
		},
    *findProject({payload},{call, put}){
      yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.START} })
      try{
        let projects = yield call([apiStore,apiStore.find], 'project', null, {forceReload: true})
        let fomatProjects = yield projects.content.map(p => {
          return {
            ...p,
            data: JSON.parse(p.data),
          }
        })
        yield put({type:'setState',payload: {projects: fomatProjects}})
        yield put({type:'setState',payload: {findProjectStatus: LOAD_STATUS.SUCCESS} })
      }
      catch(e){
        yield put({type:'setState',payload: {
            findProjectStatus: LOAD_STATUS.FAIL,
            errorMessage: e.message()
          }
        })
      }
    },
  }
}
