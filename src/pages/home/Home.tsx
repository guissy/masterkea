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

class Actions {
  onChangeFullSize = (p: any) => ({} as Action);
  onChangeOpenKeys: (p: any) => Action;
}
class States {
  fullSize = true;
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
  state = {};

  public render() {
    const { isNavbar, fullSize, hasLoginBefore } = this.props;
    const fold = !isNavbar && fullSize ? 'fold' : '';
    const navbar = isNavbar ? 'withnavbar' : '';
    const classnames = ['layout', fold, navbar].join(' ');
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
                  <Menus fullSize={fullSize} />
                </div>
              </aside>
            ) : (
              ''
            )}
            <div className={'main'}>
              <Header
                location={location}
                isNavbar={isNavbar}
                fullSize={fullSize}
                onChangeFullSize={(e: any) => {
                  this.props.actions.onChangeFullSize({ fullSize: !fullSize });
                  this.props.actions.onChangeOpenKeys({ openKeys: [] });
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