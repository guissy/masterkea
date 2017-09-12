import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Role from './Role';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 role: 分页', async () => {
  const role = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    role: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'role/query') {
      Promise.resolve().then(() => {
        store.dispatch({ type: 'role/querySuccess' });
      });
    }
    if (action && action.type === 'role/querySuccess') {
      const list = new Array(10).fill(role).map((v, i) => ({ ...v, id: i + 1 }));
      state = {
        lang,
        role: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Role />
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

test('\u2665 role: 新增', async () => {
  const role = {
    id: 1,
    name: 'jest' + String(Date.now()).substr(4),
    status: 1,
  };
  const permission = require('../../../../build/routes.json').routes;
  let state = {
    lang,
    role: { list: [] as any, permission: {}, permissionLoading: false, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'role/save') {
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'role/saveSuccess' });
      });
    }
    console.warn('\u2714 Role.spec  71', action);
    if (action && action.type === 'role/permission') {
      state = {
        ...state,
        role: { ...role, permission, permissionLoading: false },
      } as any;
    }
    if (action && action.type === 'role/saveSuccess') {
      state = {
        lang,
        role: { ...state.role, list: [{ ...role, status: 0 }] },
      };
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Role />
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
  const simpleEdit = wrapper2.find('RoleEdit');
  expect(simpleEdit.exists()).toBeTruthy();
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  wrapper2.find('#name').simulate('change', { target: { value: role.name } });
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = simpleEdit.props() as any;
  const form = props.form as WrappedFormUtils;
  form.setFieldsValue({ roles: new Map() });
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
  expect(state.role.list[0].name).toBe(role.name);
  expect(wrapper2.props().visible).toBeFalsy();
});

test('\u2665 role: 删除', async () => {
  const role = {
    id: 1,
  };
  let state = {
    lang,
    role: { list: [role] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'role/remove') {
      store.dispatch({ type: 'role/removeSuccess' });
      state = {
        lang,
        role: { ...state.role, list: [] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Role />
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
  expect(state.role.list).toHaveLength(0);
});
