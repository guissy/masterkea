import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Notice, { NoticeProps } from './Notice';

const lang = { site };

test('\u2665 Notice: props', () => {
  const store = configureStore([thunkMiddleware])({ lang, notice: { loading: true } });
  const wrapper = shallow(<Notice />, { context: { store } });
  expect(wrapper.props().notice).toEqual({ loading: true });
});

test('\u2665 Notice: ui', () => {
  const store = configureStore([thunkMiddleware])({ lang, notice: { loading: true } });
  const wrapper = mount(<Notice />, { context: { store } });
  expect(wrapper.find('div').first().getDOMNode()).toBeTruthy();
});
