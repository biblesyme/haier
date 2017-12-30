import { delay } from 'redux-saga'
export default {
	state: {
		login1: false
	},
	reducers: {
		setLogin1(state,action){
			return {
				...state,
				login: action.payload
			}
		}
	}
	,effects: {
		*asyncLogin1({ payload },{ call,put }){
			yield call(delay, 1000)
			yield put({type:'setLogin',payload: true })
		}
	}
}