import { delay } from 'redux-saga'
export default {
  state: {
    project: {},
    resources: [],
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
  }
}
