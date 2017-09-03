import { Button, Card, Form, Input, Layout, message } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import { LangSiteState, withLang } from '../lang.model';
import LoginDynamic from './Login.dynamic';
import { Action, createAction } from 'kea';
import { delay } from 'redux-saga';
import { exitAjax, loginAjax, loginTwoAjax } from './Login.service';
import { call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import './Login.css';
import createWith, { KeaProps } from '../../utils/buildKea';
import environment from '../../utils/environment';
import { MenuItem } from '../components/menu/Menus.model';
import { withMenus } from '../components/menu/Menus';

const { Header, Footer, Content } = Layout;

class Login extends React.PureComponent<LoginProps, any> {
  public static States? = class {
    loading = false;
    login = {};
    loginForm = {};
    loginTwoLoading = false;
    hasLoginBefore = false;
    loginTwoForm = {};

    lastPathname: string;
  };
  static Actions? = class {
    onChangeLoading = (p: any) => ({} as Action);
    onChangeLogin = (p: any) => ({} as Action);
    onChangeLoginForm = (p: any) => ({} as Action);
    onChangeLoginTwoLoading = (p: any) => ({} as Action);
    onChangeLoginTwoForm = (p: any) => ({} as Action);
    onChangeLogout = (p: any) => ({} as Action);
    logout = (p: any) => ({} as Action);
  };
  constructor(props: LoginProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const { site, login, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const tailFormItemLayout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <div id="Login">
        <Layout>
          <Header>平台管理系统</Header>
          <Content>
            <Card className="animated zoomIn" title="登录" bordered={false}>
              <Form onSubmit={this.onSubmit}>
                <Form.Item label={site.用户名} {...formItemLayout} hasFeedback={true}>
                  {getFieldDecorator('username', {
                    initialValue: '',
                    rules: [{ required: true, message: site.请输入您的用户名 }],
                  })(<Input size="large" placeholder={site.请输入您的用户名} />)}
                </Form.Item>
                <Form.Item label={site.密码} {...formItemLayout} hasFeedback={true}>
                  {getFieldDecorator('password', {
                    initialValue: '',
                    rules: [{ required: true, message: site.请输入您的密码 }],
                  })(<Input type="password" size="large" placeholder={site.请输入您的密码} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" size="large" loading={loading}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Content>
          <LoginDynamic
            mtoken={login.mtoken}
            secret={login.secret}
            onSubmit={this.onSubmitTwo}
            loading={login.loading}
            visible={login.visible}
            onCancel={() => this.props.actions.onChangeLogin({ login: { visible: false } })}
          />
          <Footer />
        </Layout>
      </div>
    );
  }

  componentDidMount(): void {
    this.props.form.resetFields();
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.actions.onChangeLoginForm(fieldsValue);
    });
  };

  private onSubmitTwo = (form: WrappedFormUtils) => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.actions.onChangeLoginTwoForm({ ...fieldsValue, uid: this.props.login.uid });
    });
  };
}

export const withLogin = createWith({
  namespace: 'login',
  actions: new Login.Actions(),
  state: new Login.States(),
  props: {
    site: withLang,
    lastPathname: withMenus,
  },
  start: function*(this: { actions: LoginStatic.Actions; props: LoginStatic.States }) {
    // saga started or component mounted
    // 刷新页面：已登录
    let expiration = window.sessionStorage.getItem(environment.expiration);
    if (!expiration) {
      // 复制 localStorage 到 sessionStorage，与新开页面同步
      expiration = JSON.parse(window.localStorage.getItem(environment.expiration));
      if (expiration) {
        window.sessionStorage.setItem(environment.tokenName, window.localStorage.getItem(environment.tokenName));
        window.sessionStorage.setItem(environment.expiration, window.localStorage.getItem(environment.expiration));
        window.sessionStorage.setItem(environment.adminInfo, window.localStorage.getItem(environment.adminInfo));
      }
    }
    if (parseInt(expiration, 10) * 1000 - new Date().valueOf() > 0) {
      // token 没过期
      const adminInfo = JSON.parse(window.sessionStorage.getItem(environment.adminInfo));
      if (adminInfo) {
        // dispatch({ type: 'my/querySuccess', payload: adminInfo });
        yield put(
          this.actions.onChangeLogin({
            ...adminInfo,
            hasLogin: true,
            needLogin: false,
            hasLoginBefore: true,
          })
        );

        // 有权限的菜单
        if (adminInfo.route) {
          const menu = Array.isArray(adminInfo.route) && adminInfo.route.map((v: MenuItem) => v.id);
          const subs = adminInfo.route
            .map((v: MenuItem) => v.children.map(w => w.id))
            .reduce((s: MenuItem[], w: MenuItem[]) => s.concat(w));
          // yield put({ type: 'menus/update', payload: { menu: menu.concat(subs) } });
        }

        if (location.pathname === '/login') {
          yield put(push(this.props.lastPathname));
        }
      }
    } else {
      // 判断从 window.setting 是否正常
      if (!environment.enverr) {
        if (
          location.pathname !== '/login' &&
          !location.pathname.toLowerCase().includes('error') &&
          !location.pathname.toLowerCase().includes('assets')
        ) {
          let from = location.pathname;
          if (location.pathname === environment.adminFirstPage) {
            from = environment.adminFirstPage;
          }
          window.location.href = `${location.origin}/login?from=${from}`;
        }
      }
    }
  },
  effects: {
    *logout(this: LoginProps, { payload }: any): any {
      console.log('\u2665 logout 181', 'logout');
      try {
        if (!payload || (payload && payload.needExit !== false)) {
          yield call(exitAjax, payload); // 退出也要token, 不可先清token
        }
        window.localStorage.removeItem(environment.tokenName);
        window.localStorage.removeItem(environment.expiration);
        window.localStorage.removeItem(environment.adminInfo);
        window.sessionStorage.removeItem(environment.tokenName);
        window.sessionStorage.removeItem(environment.expiration);
        window.sessionStorage.removeItem(environment.adminInfo);
        yield put(this.actions.onChangeLogout({ hasLogin: false }));
        yield put(push('/login'));
      } catch (e) {
        yield put(this.actions.onChangeLogout({ hasLogin: false }));
      }
    },
    *onChangeLoginForm(this: LoginProps, action: any): any {
      yield put(this.actions.onChangeLoading(true));
      const { key, ...params } = action.payload;
      const result = yield loginAjax(params);
      if (result.state === 0) {
        yield put(this.actions.onChangeLoading(false));
        // this.props.form.resetFields();
        yield put(this.actions.onChangeLogin({ login: { ...result.data, visible: true } }));
      } else {
        message.error(result.message);
        yield put(this.actions.onChangeLoading(false));
      }
      yield delay(100); // debounce for 100ms
      return null;
    },
    *onChangeLoginTwoForm(this: LoginProps & { props: LoginStatic.States }, action: any): any {
      yield put(this.actions.onChangeLoginTwoLoading(true));
      const result = yield loginTwoAjax(action.payload);
      if (result.state === 0) {
        message.success('欢迎回来！！！');

        const admin = result.data.list;
        admin.route = result.data.route;
        // 缓存 token，请求时放在 Header 中
        window.sessionStorage.setItem(environment.tokenName, result.data.token);
        window.sessionStorage.setItem(environment.expiration, String(result.data.expire));
        window.sessionStorage.setItem(environment.adminInfo, String(JSON.stringify(admin)));

        // 有权限的菜单
        if (admin.route) {
          const menu = admin.route.map((v: MenuItem) => v.id);
          const subs = admin.route
            .map((v: MenuItem) => v.children.map(w => w.id))
            .reduce((s: MenuItem[], w: MenuItem) => s.concat(w));
          // yield put({ type: 'menus/update', payload: { menu: menu.concat(subs) } });
        }

        yield put(
          this.actions.onChangeLogin({ login: result.data, hasLogin: true, needLogin: false, hasLoginBefore: true })
        );
        yield put(push(this.props.lastPathname));
      } else {
        message.error(result.message);
        yield put(push('/404'));
      }
      yield put(this.actions.onChangeLoginTwoLoading(false));
      yield delay(100); // debounce for 100ms
      return null;
    },
  },
});

export default Form.create()(withLogin(Login));
namespace LoginStatic {
  export class Actions extends Login.Actions {}
  export class States extends Login.States {}
}
export interface LoginProps
  extends KeaProps<LoginStatic.Actions, LoginStatic.States>,
    LangSiteState,
    FormComponentProps {}
