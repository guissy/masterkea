import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Periods, { PeriodsProps } from './Periods';

const lang = { site };

test('\u2665 Periods: props', () => {
  const store = configureStore([thunkMiddleware])({ lang, periods: { loading: true } });
  const wrapper = shallow(<Periods />, { context: { store } });
  expect(wrapper.props().periods).toEqual({ loading: true });
});

test('\u2665 Periods: ui', () => {
  const store = configureStore([thunkMiddleware])({ lang, periods: { loading: true } });
  const wrapper = mount(<Periods />, { context: { store } });
  expect(
    wrapper
      .find('div')
      .first()
      .getDOMNode()
  ).toBeTruthy();
});
