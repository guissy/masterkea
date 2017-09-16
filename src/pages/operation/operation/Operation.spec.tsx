import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Operation, { OperationProps } from './Operation';

const lang = { site };

test('\u2665 Operation: props', () => {
  const store = configureStore([thunkMiddleware])({ lang, operation: { loading: true } });
  const wrapper = shallow(<Operation />, { context: { store } });
  expect(wrapper.props().operation).toEqual({ loading: true });
});

test('\u2665 Operation: ui', () => {
  const store = configureStore([thunkMiddleware])({ lang, operation: { loading: true } });
  const wrapper = mount(<Operation />, { context: { store } });
  expect(
    wrapper
      .find('div')
      .first()
      .getDOMNode()
  ).toBeTruthy();
});
