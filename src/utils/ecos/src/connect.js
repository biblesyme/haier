const connect = require('react-redux').connect;

import React from 'react';


export default (app) => (state) => (Component,isExpose) => {
	class WrapDispatch extends React.Component {
		constructor(props) {
			super(props);
			this.dispatch = (action) => {
				console.log(this.props.match.url)
				let namespace = this.props.match.url
				namespace==='/'&&(namespace='')
				namespace += '/'
				this.props.dispatch({
					...action,
					type: namespace + action.type
				})
			}
		}
		render() {
			return <Component {...this.props} dispatch={this.dispatch}></Component>
		}
	}

	return class Connected extends React.Component {
		componentWillMount() {
			this.namespace = this.props.match.url
			if(
				!Object.hasOwnProperty.call(app._store.getState(),this.namespace)
				)
			{
				app.model({
					...state
					, namespace: this.namespace
				})
			}

			if(isExpose){
				this.ConnectedComponent = connect((state)=>{ 
					return {reduxState: state[this.namespace]} 
				})(Component)
			}else{
				this.ConnectedComponent = connect((state)=>{ 
					return {reduxState: state[this.namespace]} 
				})(WrapDispatch)
			}
		}
		componentWillUnmount() {
			app.unmodel(this.props.match.url)
		}
		render() {
			let ConnectedComponent = this.ConnectedComponent
			return <ConnectedComponent {...this.props}></ConnectedComponent>
		}
	}
}