import { delay } from 'redux-saga'
import apiStore from 'utils/apiStore'

export default {
	state: {
	},
	reducers: {
		setStatus(state, {payload}){
			return {
				...state,
				...payload
			}
		}
	}
	,effects: {
	}
}
