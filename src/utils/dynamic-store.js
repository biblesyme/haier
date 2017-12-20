import { createStore, combineReducers, applyMiddleware} from 'redux'

import createSagaMiddleware from 'redux-saga'

import effects from 'redux-saga/effects'

export default dynamicStore({state, reducers, effects}){

	// Generate Reducer
	let reducerGenarator = (state,reducers) => 
							(_state = state, action) =>
								reducers[action.type]?reducers[action.type](_state,action):_state


	let effectsGenerator = (sagaMiddleware) => (effects) => {
		let yieldEffects = []
		for(let key in effects){
			let item = effects[key]
			yieldEffects.push()
		}
		let saga = function* Saga() {
		  yield yieldEffects
		}
		sagaMiddleware.run(saga)
	}
	let initialReducers = reducerGenarator(state, reducers)

	let combinedReducer = combineReducers(initialReducers)

	const sagaMiddleware = createSagaMiddleware()

	let store = createStore(combinedReducer,null,applyMiddleware(sagaMiddleware))

	sagaMiddleware.run()

	let wrapStore = {
		...store,
		registryReducers(namespace,{state, reducers, effects}){
			let reducer = reducerGenarator(state,reducers)
			initialReducers = {
				...initialReducers
				,[namespace]: reducer
			}
			combinedReducer = combineReducers(initialReducers)
			store.replaceReducer(combinedReducer)
		}
		// ,unregistryReducer(namespace){
		// 	let newReducers = Object.keys(initialReducers).filter(el=> el!==namespace)

		// 	initialReducers = newReducers.map(el => initialReducers[el])

		// 	combinedReducer = combineReducers(initialReducers)
		// 	store.replaceReducer(combinedReducer)
		// }

	}

	return wrapStore
}