import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Halluser, { HalluserProps } from './Halluser';

const lang = { site };

test('\u2665 Halluser: props', () => {
  const state = { lang, halluser: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = shallow(<Halluser />, { context: { store } });
  expect(wrapper.props().halluser).toEqual({ loading: true });
});

test('\u2665 Halluser: ui', () => {
  const state = { lang, halluser: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = mount(<Halluser />, { context: { store } });
  expect(wrapper.find('div').getDOMNode()).toBeTruthy();
});
