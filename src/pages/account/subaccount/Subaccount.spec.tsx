import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Subaccount from './Subaccount';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 subaccount: 分页', async () => {
  const account = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    subaccount: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'subaccount/query') {
      new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        store.dispatch({ type: 'subaccount/querySuccess' });
      });
    }
    if (action && action.type === 'subaccount/querySuccess') {
      const list = new Array(99).fill(account).map((v, i) => ({ ...v, id: i }));
      state = {
        lang,
        subaccount: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Subaccount />
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

test('\u2665 subaccount: 状态', async () => {
  const account = {
    id: 1,
    username: 'jest_username',
    status: 1,
  };
  let state = {
    lang,
    subaccount: { list: [account] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  // tslint:disable-next-line
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'subaccount/status') {
      new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        store.dispatch({ type: 'subaccount/statusSuccess' });
      });
    }
    if (action && action.type === 'subaccount/statusSuccess') {
      state = {
        lang,
        subaccount: { ...state.subaccount, list: [{ ...account, status: 0 }] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Subaccount />
    </Provider>
  );
  expect(wrapper.find('.base-main').text()).toContain('jest_username');
  expect(wrapper.find('.ant-switch').text()).toBe('启用');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeTruthy();
  wrapper.find('.ant-switch').simulate('change');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-switch').text()).toBe('停用');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeFalsy();
});

test('\u2665 subaccount: 新增', async () => {
  const account = {
    id: 1,
    username: 'jest' + String(Date.now()).substr(4),
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
    subaccount: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'subaccount/save') {
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'subaccount/saveSuccess' });
      });
    }
    if (action && action.type === 'subaccount/query') {
      state = {
        ...state,
        subaccount: { ...state.subaccount, list: [account] },
      };
    }
    if (action && action.type === 'role/query') {
      Promise.resolve().then(() => {
        action.resolve(role);
      });
    }
    if (action && action.type === 'subaccount/saveSuccess') {
      state = {
        lang,
        subaccount: { ...state.subaccount, list: [{ ...account, status: 0 }] },
      };
    }
    if (action && action.type === 'subaccount/exists') {
      store.dispatch({ type: 'subaccount/existsSuccess', payload: { exists: { status: 0 } } });
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Subaccount />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('.e2e-create-btn').text()).toContain('新增');
  wrapper.find('.e2e-create-btn').simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.body.childNodes).toHaveLength(2);
  const modal = Array.from(document.body.querySelectorAll('[data-reactroot]')).pop() as any;
  expect(modal).toBeTruthy();

  // 填写表单
  const wrapper2 = mount(<Provider store={store}>{findReactElement(modal)}</Provider>);
  const simpleEdit = wrapper2.find('SimpleEdit');
  expect(simpleEdit.exists()).toBeTruthy();
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  wrapper2.find('#username').simulate('change', { target: { value: account.username } });
  wrapper2.find('#truename').simulate('change', { target: { value: account.username } });
  wrapper2.find('#password').simulate('change', { target: { value: account.username } });
  wrapper2.find('#password2').simulate('change', { target: { value: account.username } });
  wrapper2
    .find('input[type="radio"]')
    .first()
    .simulate('change', { target: { value: 1, checked: true } });
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = simpleEdit.props() as any;
  const form = props.form as WrappedFormUtils;
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
  expect(state.subaccount.list[0].username).toBe(account.username);
  expect(wrapper2.props().visible).toBeFalsy();
});

test('\u2665 subaccount: 删除', async () => {
  const account = {
    id: 1,
  };
  let state = {
    lang,
    subaccount: { list: [account] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'subaccount/remove') {
      store.dispatch({ type: 'subaccount/removeSuccess' });
      state = {
        lang,
        subaccount: { ...state.subaccount, list: [] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Subaccount />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('table').text()).toContain('删除');
  expect(wrapper.find('.ant-modal').exists()).toBeFalsy();
  wrapper
    .find('a')
    .findWhere(w => w && w.text() === '删除')
    .simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0));
  const popover = Array.from(document.body.querySelectorAll('[data-reactroot]')).pop() as any;
  expect(popover).toBeTruthy();

  // 确认框
  const wrapper2 = mount(<Provider store={store}>{findReactElement(popover)}</Provider>);
  expect(wrapper2.text()).toContain('确定');
  await new Promise(resolve => setTimeout(resolve, 200));
  wrapper2.find('.ant-btn-primary').simulate('click');
  expect(state.subaccount.list).toHaveLength(0);
});

test('\u2665 subaccount: 改密', async () => {
  const account = {
    id: 1,
    username: 'jest' + String(Date.now()).substr(4),
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
    subaccount: { list: [account] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'subaccount/password') {
      store.dispatch({ type: 'subaccount/passwordSuccess' });
    }
    if (action && action.type === 'role/query') {
      store.dispatch({ type: 'role/querySuccess', payload: role });
    }
    if (action && action.type === 'subaccount/passwordSuccess') {
      state = {
        lang,
        subaccount: { ...state.subaccount, list: [{ ...account, password: 'passwordok' }] },
      };
    }
  });
  // 改密弹框
  const wrapper = mount(
    <Provider store={store}>
      <Subaccount />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('table').text()).toContain('改密');
  wrapper
    .find('a')
    .findWhere(w => w && w.text() === '改密')
    .simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.body.childNodes).toHaveLength(2);
  const modal = Array.from(document.body.querySelectorAll('[data-reactroot]')).pop() as any;
  expect(modal).toBeTruthy();

  // 填写表单
  const wrapper2 = mount(<Provider store={store}>{findReactElement(modal)}</Provider>);
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  const passwordEdit = wrapper2.find('PasswordEdit');
  expect(passwordEdit.exists()).toBeTruthy();
  wrapper2.find('#password').simulate('change', { target: { value: 'passwordok' } });
  wrapper2.find('#password2').simulate('change', { target: { value: 'passwordok' } });
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = passwordEdit.props() as any;
  const form = props.form as WrappedFormUtils;
  const errors = Object.values(form.getFieldsError()).filter((v: string[]) => !!v);
  const emptyValues = Object.values(form.getFieldsValue()).filter((v: string[]) => !v);
  expect(errors).toHaveLength(0);
  expect(emptyValues).toHaveLength(0);
  expect(wrapper2.find('button[type="submit"]').exists()).toBeTruthy();

  // 提交表单
  passwordEdit.find('Form').simulate('submit');
  passwordEdit.find('form').simulate('submit');
  passwordEdit.find('button[type="submit"]').simulate('click');
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(state.subaccount.list[0].password).toBe('passwordok');
  expect(wrapper2.props().visible).toBeFalsy();
});
