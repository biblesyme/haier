import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'

export default {
	state: {
		findDomainStatus: LOAD_STATUS.INITIAL,
		saveDomainStatus: LOAD_STATUS.INITIAL,
		updateDomainStatus: LOAD_STATUS.INITIAL,
		findDomainAdminStatus: LOAD_STATUS.INITIAL,
		addDomainAdminStatus: LOAD_STATUS.INITIAL,
		findAccountStatus: LOAD_STATUS.INITIAL,
		doActionStatus: LOAD_STATUS.INITIAL,
		domains: [],
		domainAdmins: [],
		accounts: [],
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
		*findDomain({payload={}},{call, put}){
      let {callback} = payload
			yield put({type:'setState',payload: {findDomainStatus: LOAD_STATUS.START} })
			try{
				let domain = yield call([apiStore,apiStore.find], 'domain', null, {forceReload: true})
				yield put({type:'setState',payload: {domains: domain.content.filter(d => d.state !== 'removed')}})
				yield put({type:'setState',payload: {findDomainStatus: LOAD_STATUS.SUCCESS} })
				if(callback){
					yield call(callback)
				}
			}
			catch(e){
				yield put({type:'setState',payload: {
						findDomainStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
				if(callback){
					yield call(callback)
				}
			}
		},
		*findDomainAdmin({payload},{call, put}){
			yield put({type:'setState',payload: {findDomainAdminStatus: LOAD_STATUS.START} })
			try{
				let domainAdmins = yield call([apiStore,apiStore.find], 'domainAdmin', null, {forceReload: true})
				yield put({type:'setState',payload: {domainAdmins: domainAdmins.content.filter(a => a.state !== 'removed')}})
				yield put({type:'setState',payload: {findDomainAdminStatus: LOAD_STATUS.SUCCESS} })
			}
			catch(e){
				yield put({type:'setState',payload: {
						findDomainAdminStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
			}
		},
		*findAccount({payload},{call, put}){
			yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.START} })
			try{
				let accounts = yield call([apiStore,apiStore.find], 'account', null, {forceReload: true})
				yield put({type:'setState',payload: {accounts: accounts.content.filter(a => a.state !== 'removed')}})
				yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.SUCCESS} })
			}
			catch(e){
				yield put({type:'setState',payload: {
						findAccountStatus: LOAD_STATUS.FAIL,
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
		*doAction({payload}, {call, put}){
			let {data, action, successCB,failCB} = payload
			try{
				let record  = yield call([apiStore,apiStore.find],`${data.type}`,`${data.id}` )
				let afterActionRecord = yield call([record,record.doAction], action, {data})
				if(successCB){
					yield call(successCB,afterActionRecord)
				}
			}
			catch(e){
				if(failCB){yield call(failCB, e)}
			}
		},
	}
}
