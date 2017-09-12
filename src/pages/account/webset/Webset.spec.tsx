import { Select } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Webset from './Webset';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 webset: 分页', async () => {
  const webset = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    webset: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'webset/query') {
      Promise.resolve().then(() => {
        store.dispatch({ type: 'webset/querySuccess' });
      });
    }
    if (action && action.type === 'webset/querySuccess') {
      const list = new Array(10).fill(webset).map((v, i) => ({ ...v, id: i + 1 }));
      state = {
        lang,
        webset: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Webset />
    </Provider>
  );
  expect(
    wrapper
      .find('.base-main')
      .first()
      .text()
  ).toContain('Loading');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(
    wrapper
      .find('.ant-pagination-item a')
      .first()
      .text()
  ).toBe('1');
  expect(
    wrapper
      .find('.ant-pagination-item a')
      .last()
      .text()
  ).toBe('10');
});

test('\u2665 webset: 新增', async () => {
  const webset = {
    id: 1,
    company_account: 'jest' + String(Date.now()).substr(4),
    alias: 'www.baidu.com',
    sites: 'www.baidu.com',
    domain: 'www.baidu.com',
    access_token: 'www.baidu.com',
    jwt_token: 'www.baidu.com',
    threshold_id: 1,
    status: 1,
  };
  const threshold = {
    site_threshold: [{ id: 1, name: '一级' }],
    itemName: '角色',
    page: 1,
    page_size: 1,
    total: 1,
    loading: false,
  };
  let state = {
    lang,
    webset: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'webset/save') {
      console.log('\u2714 Webset.spec  81', action);
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'webset/saveSuccess' });
      });
    }
    if (action && action.type === 'webset/threshold') {
      action.resolve({ threshold });
      store.dispatch({ type: 'webset/thresholdSuccess', payload: threshold });
    }
    if (action && action.type === 'webset/saveSuccess') {
      state = {
        lang,
        webset: { ...state.webset, list: [{ ...webset, status: 0 }] },
      };
    }
    if (action && action.type === 'webset/exists') {
      store.dispatch({ type: 'webset/existsSuccess', payload: { exists: { status: 0 } } });
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Webset />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('.e2e-create-btn').text()).toContain('新增');
  wrapper.find('.e2e-create-btn').simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0));
  const modal = Array.from(document.body.querySelectorAll('[data-reactroot]')).pop() as any;
  expect(modal).toBeTruthy();

  // 填写表单
  const wrapper2 = mount(<Provider store={store}>{findReactElement(modal)}</Provider>);
  const simpleEdit = wrapper2.find('WebsetEdit');
  expect(simpleEdit.exists()).toBeTruthy();
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  wrapper2.find('#sites').simulate('change', { target: { value: webset.sites } });
  wrapper2.find('#domain').simulate('change', { target: { value: webset.domain } });
  wrapper2.find('#alias').simulate('change', { target: { value: webset.alias } });
  wrapper2.find('#access_token').simulate('change', { target: { value: webset.access_token } });
  wrapper2.find('#jwt_token').simulate('change', { target: { value: webset.jwt_token } });

  wrapper2
    .find('.ant-tabs-tab')
    .last()
    .simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = simpleEdit.props() as any;
  const form = props.form as WrappedFormUtils;
  form.setFieldsValue({ threshold_id: 1 });
  form.setFieldsValue({
    storage: new Array(9).fill(0).map((v: number) => ({
      port: '80',
      host: 'www.baidu.com',
      user: 'admin',
      password: '123456',
      db: 'db2',
    })),
  });
  const errors = Object.values(form.getFieldsError()).filter((v: string[]) => !!v);
  const emptyValues = Object.values(form.getFieldsValue()).filter((v: string[]) => !v);
  expect(errors).toHaveLength(0);
  expect(emptyValues).toHaveLength(0);
  expect(wrapper2.find('button[type="submit"]').exists()).toBeTruthy();

  // 提交表单
  simpleEdit.find('Form').simulate('submit');
  simpleEdit.find('form').simulate('submit');
  simpleEdit
    .find('button[type="submit"]')
    .last()
    .simulate('click');
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(state.webset.list[0].sites).toBe(webset.sites);
  expect(wrapper2.props().visible).toBeFalsy();
});
