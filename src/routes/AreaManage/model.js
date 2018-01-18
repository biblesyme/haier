import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'

export default {
	state: {
		findDomainStatus: LOAD_STATUS.INITIAL,
		saveDomainStatus: LOAD_STATUS.INITIAL,
		updateDomainStatus: LOAD_STATUS.INITIAL,
		domains: [],
	},
	reducers: {
		setState(state,{payload}){
			return {
				...state,
				...payload,
			}
		}
	}
	,effects: {
		*findDomain({payload},{call, put}){
			yield put({type:'setState',payload: {findDomainStatus: LOAD_STATUS.START} })
			try{
				let domain = yield call([apiStore,apiStore.find], 'domain', null, {forceReload: true})
				yield put({type:'setState',payload: {domains: domain.content}})
				yield put({type:'setState',payload: {findDomainStatus: LOAD_STATUS.SUCCESS} })
			}
			catch(e){
				yield put({type:'setState',payload: {
						findDomainStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
			}
		},
		*saveDomain({payload},{call, put}){
			yield put({type:'setState',payload: {saveDomainStatus: LOAD_STATUS.START} })
			try{
				let resouce = yield call([apiStore,apiStore.createRecord], payload)
				yield call([resouce,resouce.save])
				yield put({type:'setState',payload: {saveDomainStatus: LOAD_STATUS.SUCCESS} })
				let domain = yield call([apiStore,apiStore.find], 'domain', null, {forceReload: true})
				yield put({type:'setState',payload: {domains: domain.content}})
			}
			catch(e){
				yield put({type:'setState',payload: {
						saveDomainStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
			}
		},
		*updateDomain({payload, resource},{call, put}){
			yield put({type:'setState',payload: {updateDomainStatus: LOAD_STATUS.START} })
			try{
				// let resouce = yield call([apiStore,apiStore.createRecord], payload)
				yield call([resource,resource.doAction], 'update', {data: payload})
				yield put({type:'setState',payload: {updateDomainStatus: LOAD_STATUS.SUCCESS} })
				let domain = yield call([apiStore,apiStore.find], 'domain', null, {forceReload: true})
				yield put({type:'setState',payload: {domains: domain.content}})
			}
			catch(e){
				yield put({type:'setState',payload: {
						updateDomainStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
			}
		},
	}
}
