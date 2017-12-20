import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import App from './main';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  );
};

render(App);

// Hot Module Replacement API
console.log(module.hot)
if (module.hot) {
  module.hot.accept('./main', () => {
  	console.log('arguments',arguments)
    render(App)
  });
}