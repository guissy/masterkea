import * as React from 'react';
import Menus, { withMenus } from '../components/menu/Menus';
import environment from '../../utils/environment';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Home.css';
import createWith, { KeaProps } from '../../utils/buildKea';
import { Route, Switch } from 'react-router';
import router from '../../router';
import { withLogin } from '../login/Login';
import { Action } from 'kea';
import Stage from '../lottery/Stage';
import Hall from '../account/hall/Hall';
import Subaccount from '../account/subaccount/Subaccount';
import Webset from '../account/webset/Webset';
import Role from '../account/role/Role';

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
export default class Home extends React.PureComponent<KeaProps<Actions, States>, {}> {

  public render() {
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
                    <Route path="/lottery/stage" component={Stage} />
                    <Route path="/lottery/result" component={router.result} />
                    <Route path="/account/hall" component={Hall} />
                    {/*<Route path="/account/hall" component={router.hall} />*/}
                    <Route path="/account/sub" component={Subaccount} />
                    <Route path="/account/webset" component={Webset} />
                    <Route path="/account/role" component={Role} />
                    {/*<Route path="/account/sub" component={router.subaccount} />*/}
                    {/*<Route path="/thirdgame" component={router.thirdgame} />*/}
                    {/*<Route path="/notice/message" component={router.message} />*/}
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