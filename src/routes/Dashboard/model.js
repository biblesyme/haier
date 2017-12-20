import { delay } from 'redux-saga'
export default {
	state: {
		login: false
	},
	reducers: {
		setLogin(state,action){
			return {
				...state,
				login: action.payload
			}
		}
	}
	,effects: {
		*asyncLogin({ payload },{ call,put }){
			yield call(delay, 1000)
			yield put({type:'setLogin',payload: true })
		}
	}
}