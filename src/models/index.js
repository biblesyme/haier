import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'
import axios from 'axios'
// import stateKeyGenerator from 'utils/stateKeyGenerator'

export default {
	state: {
		login: false,
		loadSchemaStatus: LOAD_STATUS.INITIAL,
		findAccountStatus: LOAD_STATUS.INITIAL,
		errorMessage: '',
		role: 'admin',
		loading: false,
    selectedKeys: [],
		accounts: [],
		user: {},
		form: {},
		preview: false,
		locations: [],
	},
	reducers: {
		setState(state,{payload}){
			return {
				...state,
				...payload
			}
		}
	},
	effects: {
		*loadSchema({payload={}},{call, put}){
			const {failCB, successCB} = payload
			yield put({type:'setState',payload: {loadSchemaStatus: LOAD_STATUS.START} })
			try{
				let schema = yield call([apiStore,apiStore.find], 'schema')
				yield put({type:'setState',payload: {loadSchemaStatus: LOAD_STATUS.SUCCESS} })
				if(successCB){yield call(successCB)}
			}
			catch(e){
				yield put({type:'setState',payload: {
						loadSchemaStatus: LOAD_STATUS.FAIL,
					}
				})
				if(failCB){yield call(failCB, e)}
			}
		},
		*findAccount({payload={}},{call, put}){
			const {failCB, successCB} = payload
			yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.START} })
			try{
				let accounts = yield call([apiStore,apiStore.find], 'account', null, {forceReload: true})
				yield put({type:'setState',payload: {accounts: accounts.content}})
				yield put({type:'setState',payload: {findAccountStatus: LOAD_STATUS.SUCCESS} })
				if(successCB){yield call(successCB)}
			}
			catch(e){
				yield put({type:'setState',payload: {
						findAccountStatus: LOAD_STATUS.FAIL,
					}
				})
			}
		},
		*saveRecord({payload},{call, put}){
			let {data, successCB, failCB} = payload
			try{
				let record = apiStore.createRecord(data)
				let afterSave = yield call([record,record.save])
				if(successCB){
					yield call(successCB,afterSave)
				}
			}
			catch(e){
				if(failCB){yield call(failCB, e)}
			}
		},
		*doAction({payload={}}, {call, put}){
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
		*followLink({payload={}}, {call, put}){
			let {data, link, successCB,failCB} = payload
			try{
				let record  = yield call([apiStore,apiStore.find],`${data.type}`,`${data.id}` )
				let afterLink = yield call([record,record.followLink], link)
				if(successCB){yield call(successCB,afterLink)}
			}
			catch(e){
				if(failCB){yield call(failCB, e)}
			}
		},
		*findLocation({payload={}}, {call, put}){
			let {successCB} = payload
			try {
				let location = yield call([axios, axios.get], `/v1/query/paas/locations`)
				yield put({type: 'setState', payload: {locations: location.data.data}})
				if (successCB) {yield call(successCB, location)}
			}
			catch(e) {

			}
		},
		*followCluster({payload={}}, {call, put}){
			let {data, successCB} = payload
			try {
				let cluster = yield call([axios, axios.get], `/v1/query/paas/locations/${data.id}/clusters`)
				if (successCB) {yield call(successCB, cluster)}
			}
			catch(e) {

			}
		},
		*findMachineRoom({payload={}}, {call, put}) {
			let {successCB} = payload
			try {
				let machineRoom = yield call([axios, axios.get], `/v1/query/mid/machineRooms`)
				if (successCB) {yield call(successCB, machineRoom)}
			}
			catch(e) {}
		},
		*followClusterDetail({payload={}}, {call, put}) {
			let {data={}, successCB} = payload
			try {
				let clusterDetail = yield call([axios, axios.get], `/v1/query/paas/clusterInfo/${data.id}`)
				if (successCB) {yield call(successCB, clusterDetail)}
			} catch (e) {

			}
		},
		*doSelfAction({payload={}}, {call, put}){
			let {data, action, successCB,failCB, findRecord} = payload
			try{
				let record  = yield call([apiStore,apiStore.find], findRecord.type, findRecord.id, {forceReload: true})
				let afterLink = yield call([record,record.followLink], 'self')
				let afterActionRecord = yield call([afterLink,afterLink.doAction], action, {data})
				console.log(afterActionRecord)
				if(successCB){
					yield call(successCB,afterActionRecord)
				}
			}
			catch(e){
				if(failCB){yield call(failCB, e)}
			}
		},
		*findUser({payload={}},{call, put}){
			const {failCB, successCB, id} = payload
			try{
				let accounts = yield call([apiStore,apiStore.find], 'account', id, {forceReload: true})
				console.log(accounts)
				yield put({type:'setState',payload: {user: accounts}})
				if(successCB){yield call(successCB)}
			}
			catch(e){
			}
		},
	}
}
