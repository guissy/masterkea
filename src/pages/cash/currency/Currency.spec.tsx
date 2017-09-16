import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Currency from './Currency';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 currency: 没有分页', async () => {
  const currency = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    currency: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'currency/query') {
      Promise.resolve().then(() => {
        store.dispatch({ type: 'currency/querySuccess' });
      });
    }
    if (action && action.type === 'currency/querySuccess') {
      const list = new Array(10).fill(currency).map((v, i) => ({ ...v, id: i + 1 }));
      // page>0时有翻页，如果服务器返回空值就无翻页
      state = {
        lang,
        currency: { list, loading: false, page: 0, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Currency />
    </Provider>
  );
  expect(
    wrapper
      .find('.base-main')
      .first()
      .text()
  ).toContain('Loading');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-pagination-item a').exists()).toBeFalsy();
});

test('\u2665 currency: 没有新增', async () => {
  const currency = {
    id: 1,
    name: 'jest' + String(Date.now()).substr(4),
    status: 1,
  };
  const role = {
    list: [{ id: 1, role: '技术', num: '12', created: '2017-08-07 07:50:02', creator: 'xiaoming' }],
    itemName: '角色',
    page: 1,
    page_size: 1,
    total: 1,
    loading: false,
  };
  let state = {
    lang,
    currency: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'currency/save') {
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'currency/saveSuccess' });
      });
    }
    if (action && action.type === 'role/query') {
      store.dispatch({ type: 'role/querySuccess', payload: role });
    }
    if (action && action.type === 'currency/saveSuccess') {
      state = {
        lang,
        currency: { ...state.currency, list: [{ ...currency, status: 0 }] },
      };
    }
    if (action && action.type === 'currency/exists') {
      store.dispatch({ type: 'currency/existsSuccess', payload: { exists: { status: 0 } } });
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Currency />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('.e2e-create-btn').exists()).toBeFalsy();
});

test('\u2665 currency: 没有删除', async () => {
  const currency = {
    id: 1,
  };
  let state = {
    lang,
    currency: { list: [currency] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'currency/remove') {
      store.dispatch({ type: 'currency/removeSuccess' });
      state = {
        lang,
        currency: { ...state.currency, list: [] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Currency />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('table').text()).not.toContain('删除');
});
