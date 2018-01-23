import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'
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
		*loadSchema({payload},{call, put}){
			yield put({type:'setState',payload: {loadSchemaStatus: LOAD_STATUS.START} })
			try{
				let schema = yield call([apiStore,apiStore.find], 'schema')
				yield put({type:'setState',payload: {loadSchemaStatus: LOAD_STATUS.SUCCESS} })
			}
			catch(e){
				yield put({type:'setState',payload: {
						loadSchemaStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
					}
				})
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
				yield put({type:'setState',payload: {
						findAccountStatus: LOAD_STATUS.FAIL,
						errorMessage: e.message()
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
		}
	}
}
