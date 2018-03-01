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
    *findAccount({payload={}},{call, put}){
      let {callback, successCB} = payload
      yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.START} })
      try{
        let accounts = yield call([apiStore,apiStore.find], 'account', null, {forceReload: true})
        // let record = accounts.content.map(a => {
        //   let afterLink = yield call([apiStore,accounts.importLink], 'projectParticipants')
        //   console.log(afterLink, 'afterLink')
        // })
        // let afterImport = yield call([apiStore,accounts.importLink], 'projectParticipants')
        yield put({type:'setState',payload: {accounts: accounts.content}})
        yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.SUCCESS} })
        if(callback){
          yield call(callback)
        }
        if(successCB){yield call(successCB, accounts.content)}
      }
      catch(e){
        yield put({type:'setState',payload: {
            findAccountStatus: LOAD_STATUS.FAIL,
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
      }
      catch(e){
        yield put({type:'setState',payload: {
            findProjectStatus: LOAD_STATUS.FAIL,
            errorMessage: e.message()
          }
        })
      }
    },
    *followLink({payload={}}, {call, put}){
      let {record, link, successCB,failCB} = payload
      try{
        let afterLink = yield call([record,record.followLink], link)
        if(successCB){yield call(successCB,afterLink)}
      }
      catch(e){
        if(failCB){yield call(failCB, e)}
      }
    },
  }
}
