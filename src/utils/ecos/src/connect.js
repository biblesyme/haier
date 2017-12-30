import React from 'react';

import error from '../utils/error'
const connect = require('react-redux').connect;


export default (app) => (state, connectState = []) => (Component, isLongLife) => {
	class WrapDispatch extends React.Component {
		constructor(props) {
			super(props);
			this.selfDispatch = (action) => {
				this.namespace = Component.name
				if(!this.namespace){
					error('Component passed to modelConnect should have a name!')
				}
				this.props.dispatch({
					...action,
					type: this.namespace + '/' + action.type
				})
			}
		}
		render() {
			return <Component {...this.props} selfDispatch={this.selfDispatch}></Component>
		}
	}

	return class Connected extends React.Component {
		componentWillMount() {
			this.namespace = Component.name
			if(!this.namespace){
				error('Component passed to modelConnect should have a name!')
			}
			if(
				!Object.hasOwnProperty.call(app._store.getState(),this.namespace)
				)
			{
				if(state){
					app.model({
						namespace: this.namespace
						, ...state
					})
				}
			}else{
				if(process.env.NODE_ENV !== 'production'){
					console.warn(`You used the same component ${this.namespace}, we will not register the model`);
				}
			}

			this.ConnectedComponent = connect((state)=>{ 
				let connectedState = {reduxState: state[this.namespace]}
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
				}
				return connectedState
			})(WrapDispatch)
		}
		componentWillUnmount() {
			if(!isLongLife){
				app.unmodel(this.namespace)
			}
		}
		render() {
			let ConnectedComponent = this.ConnectedComponent
			return <ConnectedComponent {...this.props}></ConnectedComponent>
		}
	}
}