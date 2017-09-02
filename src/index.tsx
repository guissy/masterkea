import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // add this
import './index.css';
import '../node_modules/antd/dist/antd.min.css';
import store, { history } from './store'; // add this (before import App !!!)
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ConnectedRouter } from 'react-router-redux';
import router from './router';
function render() {
  ReactDOM.render(
    // update this
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
}
registerServiceWorker();
window.__keaPrerender = Object.keys(router);
if (typeof window !== 'undefined' && window.__keaPrerender) {
  Promise.all(window.__keaPrerender.map((chunk: any) => router[chunk].loadComponent()))
    .then(render)
    .catch(render);
} else {
  render();
}
