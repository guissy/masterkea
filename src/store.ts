import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { keaSaga, keaReducer, Action } from 'kea';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';

export const history = createHistory({ forceRefresh: false });

const reducers = combineReducers({
  router: routerReducer,
  scenes: keaReducer('scenes'),
});

export const routeSelector = (state: any) => state.router.location;

const sagaMiddleware = createSagaMiddleware({
  logger: (level, ...h) => console.log('☞☞☞ store logger 17', level, h),
  // onError: (error: Error) => {
  // },
});
const middle =
  typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : (p: any) => ({} as Action);
const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware),
  applyMiddleware(routerMiddleware(history)),
  middle as Function
)(createStore);

const store = finalCreateStore(reducers);

sagaMiddleware.run(keaSaga);

export default store;
