import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Game, { GameProps } from './Game';

const lang = { site };

test('\u2665 Game: props', () => {
  const store = configureStore([thunkMiddleware()])({ lang, game: { loading: true } });
  const wrapper = shallow(<Game />, { context: { store } });
  expect(wrapper.props().game).toEqual({ loading: true });
});

test('\u2665 Game: ui', () => {
  const store = configureStore([thunkMiddleware()])({ lang, game: { loading: true } });
  const wrapper = mount(<Game />, { context: { store } });
  expect(wrapper.find('div').first().getDOMNode()).toBeTruthy();
});
