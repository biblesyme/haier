// import createHistory from 'history/createBrowserHistory'
import createHistory from 'history/createHashHistory'

import {
  routerMiddleware,
  routerReducer as router,
} from 'react-router-redux';

import createDva from './createEcos';

const history = createHistory()

export default createDva({
  mobile: false,
  initialReducer: {
    router,
  },
  defaultHistory: history,
  routerMiddleware,
  setupHistory(history) {
    this._history = history;
  },
});
