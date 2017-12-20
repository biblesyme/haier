import { delay } from 'redux-saga'
export default {
	state: '',
	reducers: {
		setText(state,action){
			return action.payload
		}
	}
	,effects: {
		*asyncsetText({ payload },{ call,put }){
			yield call(delay, 1000)
			yield put({type:'setText',payload: payload })
		}
	}
}
