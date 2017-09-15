import { WrappedFormUtils } from 'antd/lib/form/Form';
import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Mtoken from './Mtoken';

function findReactElement(html: any): React.ReactElement<any> {
  const name = Object.keys(Object(html)).filter(key => key.match(/^__reactInternalInstance\$/))[0];
  return html[name]._currentElement as React.ReactElement<any>;
}

const lang = { site };
test('\u2665 mtoken: 分页', async () => {
  const mtoken = {
    id: 1,
    status: 1,
  };
  let state = {
    lang,
    mtoken: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'mtoken/query') {
      Promise.resolve().then(() => {
        store.dispatch({ type: 'mtoken/querySuccess' });
      });
    }
    if (action && action.type === 'mtoken/querySuccess') {
      const list = new Array(10).fill(mtoken).map((v, i) => ({ ...v, id: i + 1 }));
      state = {
        lang,
        mtoken: { list, loading: false, page: 1, page_size: 10, total: 99 },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Mtoken />
    </Provider>
  );
  expect(wrapper.find('.base-main').first().text()).toContain('Loading');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-pagination-item a').first().text()).toBe('1');
  expect(wrapper.find('.ant-pagination-item a').last().text()).toBe('10');
});

test('\u2665 mtoken: 状态', async () => {
  const mtoken = {
    id: 1,
    company_account: 'jest_name',
    status: 'enable',
  };
  let state = {
    lang,
    mtoken: { list: [mtoken] as any, loading: false, page: 0, page_size: 0, total: 0 },
  };
  // tslint:disable-next-line
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'mtoken/status') {
      new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        store.dispatch({ type: 'mtoken/statusSuccess' });
      });
      state = {
        lang,
        mtoken: { ...state.mtoken, loading: true },
      };
    }
    if (action && action.type === 'mtoken/statusSuccess') {
      state = {
        lang,
        mtoken: { ...state.mtoken, loading: false, list: [{ ...mtoken, status: 'disable' }] },
      };
    }
  });
  const wrapper = mount(
    <Provider store={store}>
      <Mtoken />
    </Provider>
  );
  expect(wrapper.find('.base-main').text()).toContain('jest_name');
  expect(wrapper.find('.ant-switch').text()).toBe('允许');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeTruthy();
  wrapper.find('.ant-switch').simulate('change');
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(wrapper.find('.ant-switch').text()).toBe('限制');
  expect(wrapper.find('.ant-switch').hasClass('ant-switch-checked')).toBeFalsy();
});

test('\u2665 mtoken: 新增', async () => {
  const mtoken = {
    id: 1,
    name: 'jest' + String(Date.now()).substr(4),
    opt_account: '123',
    opt_password: '123',
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
    mtoken: { list: [] as any, loading: true, page: 0, page_size: 0, total: 0 },
  };
  const store = configureStore([thunkMiddleware])(() => state);
  store.subscribe(() => {
    const action = store.getActions().shift();
    if (action && action.type === 'mtoken/save') {
      Promise.resolve().then(resolve => {
        store.dispatch({ type: 'mtoken/saveSuccess' });
      });
    }
    if (action && action.type === 'role/query') {
      store.dispatch({ type: 'role/querySuccess', payload: role });
    }
    if (action && action.type === 'mtoken/saveSuccess') {
      state = {
        lang,
        mtoken: { ...state.mtoken, list: [{ ...mtoken, status: 0 }] },
      };
    }
    if (action && action.type === 'mtoken/exists') {
      store.dispatch({ type: 'mtoken/existsSuccess', payload: { exists: { status: 0 } } });
    }
  });
  // 新增弹框
  const wrapper = mount(
    <Provider store={store}>
      <Mtoken />
    </Provider>,
    { attachTo: document.body }
  );
  expect(wrapper.find('.e2e-create-btn').text()).toContain('新增');
  wrapper.find('.e2e-create-btn').simulate('click');
  await new Promise(resolve => setTimeout(resolve, 0));
  const modal = Array.from(document.body.querySelectorAll('[data-reactroot]')).pop() as any;
  expect(modal).toBeTruthy();

  // 填写表单
  const wrapper2 = mount(
    <Provider store={store}>
      {findReactElement(modal)}
    </Provider>
  );
  const simpleEdit = wrapper2.find('SimpleEdit');
  expect(simpleEdit.exists()).toBeTruthy();
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新
  wrapper2.find('#opt_account').simulate('change', { target: { value: mtoken.opt_account } });
  wrapper2.find('#opt_password').simulate('change', { target: { value: mtoken.opt_password } });
  await new Promise(resolve => setTimeout(resolve, 0)); // Promise 需要异步刷新

  // 表单验证
  const props = simpleEdit.props() as any;
  const form = props.form as WrappedFormUtils;
  form.setFieldsValue({ company_account: 1 });
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
  expect(state.mtoken.list[0].name).toBe(mtoken.name);
  expect(wrapper2.props().visible).toBeFalsy();
});
