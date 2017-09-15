import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Logs from './Logs';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 logs: 分页', async () => {
  const logs = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    logs: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'logs/query') {
      Promise.resolve().then(() => {
        store.dispatch({ type: 'logs/querySuccess' });
      });
    }
    if (action && action.type === 'logs/querySuccess') {
      const list = new Array(10).fill(logs).map((v, i) => ({ ...v, id: i + 1 }));
      state = {
        lang,
        logs: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Logs />
    </Provider>
  );
  expect(wrapper.find('.base-main').first().text()).toContain('Loading');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-pagination-item a').first().text()).toBe('1');
  expect(wrapper.find('.ant-pagination-item a').last().text()).toBe('10');
});
