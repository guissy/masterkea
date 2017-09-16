import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Summary, { SummaryProps } from './Summary';

const lang = { site };

test('\u2665 Summary: props', () => {
  const state = { lang, summary: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = shallow(<Summary />, { context: { store } });
  expect(wrapper.props().summary).toEqual({ loading: true });
});

test('\u2665 Summary: ui', () => {
  const state = { lang, summary: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = mount(<Summary />, { context: { store } });
  expect(wrapper.find('div').getDOMNode()).toBeTruthy();
});
