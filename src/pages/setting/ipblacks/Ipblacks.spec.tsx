import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Ipblacks, { IpblacksProps } from './Ipblacks';

const lang = { site };

test('\u2665 Ipblacks: props', () => {
  const store = configureStore([thunkMiddleware])({ lang, ipblacks: { loading: true } });
  const wrapper = shallow(<Ipblacks />, { context: { store } });
  expect(wrapper.props().ipblacks).toEqual({ loading: true });
});

test('\u2665 Ipblacks: ui', () => {
  const store = configureStore([thunkMiddleware])({ lang, ipblacks: { loading: true } });
  const wrapper = mount(<Ipblacks />, { context: { store } });
  expect(wrapper.find('div').first().getDOMNode()).toBeTruthy();
});
