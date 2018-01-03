import { delay } from 'redux-saga'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import apiStore from 'utils/apiStore'

export default {
	state: {
		domainForm: {

		},
		saveStatus: LOAD_STATUS.INITIAL,
		saveError: '',
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