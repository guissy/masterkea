import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Order, { OrderProps } from './Order';

const lang = { site };

test('\u2665 Order: props', () => {
  const state = { lang, order: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = shallow(<Order />, { context: { store } });
  expect(wrapper.props().order).toEqual({ loading: true });
});

test('\u2665 Order: ui', () => {
  const state = { lang, order: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = mount(<Order />, { context: { store } });
  expect(wrapper.find('div').getDOMNode()).toBeTruthy();
});
