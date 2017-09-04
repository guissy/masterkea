import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Action, keaReducer, keaSaga } from 'kea';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';

export const history = createHistory({ forceRefresh: false });

const reducers = combineReducers({
  router: routerReducer,
  scenes: keaReducer('scenes'),
});

export const routeSelector = (state: any) => state.router.location;

const sagaMiddleware = createSagaMiddleware(
  {
    // logger: (level, ...h) => console.log('☞☞☞ store logger 17', level, h),
    // onError: (error: Error) => {
    //   console.error('\u2718'.repeat(88), error);
    // },
  }
);
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
