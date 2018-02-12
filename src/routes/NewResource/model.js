import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'
import axios from 'axios'

export default {
  state: {
    project: {},
    resources: [],
    allProjects: [],
    allResource: [],
    projectInfo: {},
  },
  reducers: {
    setState(state,{payload}){
			return {
				...state,
				...payload
			}
		},
  },
  effects: {
    *followProjectLink({payload={}}, {call, put}){
      let {data, link, successCB,failCB} = payload
      try{
        let record  = yield call([apiStore,apiStore.find],`${data.type}`,`${data.id}` )
        let afterLink = yield call([record,record.followLink], link)
        yield put({type:'setState',payload: {project: afterLink}})
        if(successCB){yield call(successCB,afterLink)}
      }
      catch(e){
        if(failCB){yield call(failCB, e)}
      }
    },
    *followResourceLink({payload={}}, {call, put}){
      let {data, link, successCB,failCB} = payload
      try{
        let record  = yield call([apiStore,apiStore.find],`${data.type}`,`${data.id}` )
        let afterLink = yield call([record,record.followLink], link)
        let fomatResources = yield afterLink.content.map(r => {
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
        if(successCB){yield call(successCB,afterLink)}
      }
      catch(e){
        if(failCB){yield call(failCB, e)}
      }
    },
    *findProject({payload={}},{call, put}){
      let {callback} = payload
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
        yield put({type:'setState',payload: {allProjects: fomatProjects}})
        if(callback){
          yield call(callback)
        }
      }
      catch(e){
        yield put({type:'setState',payload: {
            findProjectStatus: LOAD_STATUS.FAIL,
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
        yield put({type:'setState',payload: {allResource: fomatResources}})
        if(callback){
          yield call(callback)
        }
      }
      catch(e){
        yield put({type:'setState',payload: {
            findResourceStatus: LOAD_STATUS.FAIL,
          }
        })
        if(callback){
          yield call(callback)
        }
      }
    },
    *findProjectInfo({payload={}}, {call, put}) {
      let {scode} = payload
      try {
        let projectInfo = yield call([axios, axios.get], `/v1/query/projects/${scode}`)
        yield put({type: 'setState', payload: {projectInfo: projectInfo.data.data}})
      } catch (e) {

      }
    },
  }
}
