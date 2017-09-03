import * as React from 'react';
import { Modal } from 'antd';
import Menus, { withMenus } from '../components/menu/Menus';
import { History } from 'history';
import environment from '../../utils/environment';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Home.css';
import createWith, { KeaProps } from '../../utils/buildKea';
import { Route, Switch } from 'react-router';
import router from '../../router';
import { withLogin } from '../login/Login';
import { Action } from 'kea';
import PasswordEdit from '../subaccount/PasswordEdit';

class Actions {
  onChangeFullSize = (p: any) => ({} as Action);
  onChangeOpenKeys: (p: any) => Action;
}
class States {
  collapsed = true; // 折叠
  isNavbar = false;
  openKeys = [] as any[];

  hasLoginBefore: boolean;
}

@createWith({
  namespace: 'home',
  actions: new Actions(),
  state: new States(),
  props: {
    onChangeOpenKeys: withMenus,
    hasLoginBefore: withLogin,
  },
})
export default class Home extends React.PureComponent<HomeProps, {}> {
  state = {};

  public render() {
    const pathname = this.props.history.location.pathname;
    const { isNavbar, collapsed, hasLoginBefore } = this.props;
    const fold = !isNavbar && collapsed ? 'fold' : '';
    const navbar = isNavbar ? 'withnavbar' : '';
    const classnames = ['layout', fold, navbar].join(' ');
    window.defaultSelectedKeys = ['1'];
    return (
      <div>
        {hasLoginBefore && (
          <div className={classnames}>
            {!isNavbar ? (
              <aside className={'sider light'}>
                <div>
                  <div className={'logo'}>
                    <img alt="logo" src={environment.logo} />
                  </div>
                  <Menus collapsed={collapsed} />
                </div>
              </aside>
            ) : (
              ''
            )}
            <div className={'main'}>
              <Header
                location={location}
                isNavbar={isNavbar}
                collapsed={collapsed}
                onChangeFullSize={(e: any) => {
                  this.props.actions.onChangeFullSize({ collapsed: !collapsed });
                }}
              />
              <div className={'container'}>
                <div className={'content'}>
                  {/*<Route path="lottery/result" />*/}
                  <Switch>
                    <Route path="/lottery/stage" component={router.stage} />
                    <Route path="/lottery/result" component={router.result} />
                    <Route path="/thirdgame" component={router.thirdgame} />
                    <Route path="/*" component={router.notFound} />
                  </Switch>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export interface HomeProps extends KeaProps<Actions, States> {
  pathname?: string;
  history?: History;
}
