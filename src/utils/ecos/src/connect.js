import React from 'react';

import error from '../utils/error'
const connect = require('react-redux').connect;


export default (app) => (model, connectState = [], apiStoreMap) => (Component, isLongLife) => {
	class WrapDispatch extends React.Component {
		constructor(props) {
			super(props);
			this.selfDispatch = (action) => {
				let namespace = Component.name
				if(!namespace){
					error('Component passed to modelConnect should have a name!')
				}
				this.props.dispatch({
					...action,
					type: namespace + '/' + action.type
				})
			}
		}
		render() {
			return <Component {...this.props} selfDispatch={this.selfDispatch}></Component>
		}
	}

	return class Connected extends React.Component {
		constructor(props) {
			super(props)
			this.state =  {
				namespace : Component.name
			}
		}
		componentWillMount() {
			let namespace = this.state.namespace
			if(!namespace){
				error('Component passed to modelConnect should have a name!')
			}
			if(
				!Object.hasOwnProperty.call(app._store.getState(),namespace)
				)
			{
				if(model){
					app.model({
						namespace
						, ...model
					})
				}
			}else{
				if(process.env.NODE_ENV !== 'production'){
					console.warn(`You used the same component ${this.state.namespace}, we will not register the model`);
				}
			}

			this.ConnectedComponent = connect((state)=>{ 
				let connectedState = {reduxState: state[this.state.namespace]}
				if(Array.isArray(connectState)){
					for (var i = 0; i < connectState.length; i++) {
						let item = connectState[i]
						connectedState[item] = state[item]
					}
				}
				else if(typeof connectState === 'object'){
					let keys = Object.keys(connectState)
					for (var i = 0; i < keys.length; i++) {
						let item = keys[i]
						connectedState[item] = state[connectState[item]];
					}
				}else if(typeof connectState === 'function'){
					connectedState = connectState(state)
				}
				if(apiStoreMap && (typeof apiStoreMap === 'function')){
					connectedState = {
						...connectedState,
						...apiStoreMap(api)
					}
				}
				return connectedState
			})(WrapDispatch)
		}
		componentWillUnmount() {
			let namespace = this.state.namespace
			if(!isLongLife
				&& Object.hasOwnProperty.call(app._store.getState(),namespace)
				){
				app.unmodel(namespace)
			}
		}
		render() {
			let ConnectedComponent = this.ConnectedComponent
			return <ConnectedComponent {...this.props}></ConnectedComponent>
		}
	}
}