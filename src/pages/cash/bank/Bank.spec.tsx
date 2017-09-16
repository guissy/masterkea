import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Bank from './Bank';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 bank: 分页', async () => {
  const bank = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    bank: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'bank/query') {
      new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        store.dispatch({ type: 'bank/querySuccess' });
      });
    }
    if (action && action.type === 'bank/querySuccess') {
      const list = new Array(10).fill(bank).map((v, i) => ({ ...v, id: i }));
      state = {
        lang,
        bank: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Bank />
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

test('\u2665 bank: 状态', async () => {
  const bank = {
    id: 1,
    name: 'jest_name',
    status: 1,
  };
  let state = {
    lang,
    bank: { list: [bank] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  // tslint:disable-next-line
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'bank/status') {
      new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        store.dispatch({ type: 'bank/statusSuccess' });
      });
    }
    if (action && action.type === 'bank/statusSuccess') {
      state = {
        lang,
        bank: { ...state.bank, list: [{ ...bank, status: 0 }] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Bank />
    </Provider>
  );
  expect(wrapper.find('.base-main').text()).toContain('jest_name');
  expect(wrapper.find('.ant-switch').text()).toBe('启用');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeTruthy();
  wrapper.find('.ant-switch').simulate('change');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-switch').text()).toBe('停用');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeFalsy();
});

test('\u2665 bank: 新增', async () => {
  const bank = {
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
    bank: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'bank/save') {
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'bank/saveSuccess' });
      });
    }
    if (action && action.type === 'role/query') {
      store.dispatch({ type: 'role/querySuccess', payload: role });
    }
    if (action && action.type === 'bank/saveSuccess') {
      state = {
        lang,
        bank: { ...state.bank, list: [{ ...bank, status: 0 }] },
      };
    }
    if (action && action.type === 'bank/exists') {
      store.dispatch({ type: 'bank/existsSuccess', payload: { exists: { status: 0 } } });
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Bank />
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
  const simpleEdit = wrapper2.find('SimpleEdit');
  expect(simpleEdit.exists()).toBeTruthy();
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  wrapper2.find('#name').simulate('change', { target: { value: bank.name } });
  wrapper2.find('#shortname').simulate('change', { target: { value: bank.name } });
  wrapper2.find('#code').simulate('change', { target: { value: bank.name } });
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = simpleEdit.props() as any;
  const form = props.form as WrappedFormUtils;
  form.setFieldsValue({ logo: 'http://www.baidu.com/logo.png' });
  const errors = Object.values(form.getFieldsError()).filter((v: string[]) => !!v);
  const emptyValues = Object.values(form.getFieldsValue()).filter((v: string[]) => !v);
  expect(errors).toHaveLength(0);
  expect(emptyValues).toHaveLength(0);
  expect(wrapper2.find('button[type="submit"]').exists()).toBeTruthy();

  // 提交表单
  simpleEdit.find('Form').simulate('submit');
  simpleEdit.find('form').simulate('submit');
  simpleEdit.find('button[type="submit"]').simulate('click');
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(state.bank.list[0].name).toBe(bank.name);
  expect(wrapper2.props().visible).toBeFalsy();
});

test('\u2665 bank: 删除', async () => {
  const bank = {
    id: 1,
  };
  let state = {
    lang,
    bank: { list: [bank] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'bank/remove') {
      store.dispatch({ type: 'bank/removeSuccess' });
      state = {
        lang,
        bank: { ...state.bank, list: [] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Bank />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('table').text()).not.toContain('删除');
});
