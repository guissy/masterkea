import { mount, shallow } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store'; // tslint:disable-line import-name
import site from '../../../locale/zh-CN';
import thunkMiddleware from '../../../utils/thunkMiddleware';
import Build from './Build';

const lang = { site };

test('\u2665 Build: props', () => {
  const state = {
    lang,
    build: { loading: true },
    hall: { hallGame: [] as any },
    webset: { noAssign: [] as any },
  };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = shallow(<Build />, { context: { store } });
  expect(wrapper.props().build).toEqual({ loading: true });
});

test('\u2665 Build: ui', () => {
  const state = {
    lang,
    build: { loading: true },
    hall: { hallGame: [] as any },
    webset: { noAssign: [] as any },
  };
  const store = configureStore([thunkMiddleware])(state);
  const wrapper = mount(<Build />, { context: { store } });
  expect(
    wrapper
      .find('div')
      .first()
      .getDOMNode()
  ).toBeTruthy();
});
