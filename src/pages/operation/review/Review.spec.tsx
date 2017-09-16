import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Review, { ReviewProps } from './Review';

const lang = { site };

test('\u2665 Review: props', () => {
  const store = configureStore([thunkMiddleware])({ lang, review: { loading: true, info: [] } });
  const wrapper = shallow(<Review />, { context: { store } });
  expect(wrapper.props().review).toEqual({ loading: true, info: [] });
});

test('\u2665 Review: ui', () => {
  const store = configureStore([thunkMiddleware])({ lang, review: { loading: true, info: [] } });
  const wrapper = mount(<Review />, { context: { store } });
  expect(
    wrapper
      .find('div')
      .first()
      .getDOMNode()
  ).toBeTruthy();
});
