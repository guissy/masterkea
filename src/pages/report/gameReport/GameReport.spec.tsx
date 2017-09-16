import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import GameReport, { GameReportProps } from './GameReport';

const lang = { site };

test('\u2665 GameReport: props', () => {
  const state = { lang, gameReport: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = shallow(<GameReport />, { context: { store } });
  expect(wrapper.props().gameReport).toEqual({ loading: true });
});

test('\u2665 GameReport: ui', () => {
  const state = { lang, gameReport: { loading: true } };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = mount(<GameReport />, { context: { store } });
  expect(wrapper.find('div').getDOMNode()).toBeTruthy();
});
