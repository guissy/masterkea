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
import Message from '../notice/message/Message';
import Game from '../setting/game/Game';
import Ipblacks from '../setting/ipblacks/Ipblacks';
import Logs from '../setting/logs/Logs';
import Mtoken from '../setting/mtoken/Mtoken';
import Notice from '../notice/notice/Notice';
import Order from '../risk/order/Order';
import Currency from '../cash/currency/Currency';
import Pay from '../cash/pay/Pay';
import Bank from '../cash/bank/Bank';
import Gameid from '../account/gameid/gameid';
import Build from '../account/build/Build';
import Halluser from '../account/halluser/Halluser';
import HallCost from '../market/hallCost';
import Operation from '../operation/operation/Operation';
import Review from '../operation/review/Review';
import GameReport from '../report/gameReport/GameReport';
import Summary from '../report/summary/Summary';
import Periods from '../report/periods/Periods';

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
                    <Route path="/lottery/date" component={Stage} />
                    <Route path="/lottery/result" component={router.result} />
                    <Route path="/account/hall" component={Hall} />
                    {/*<Route path="/account/hall" component={router.hall} />*/}
                    <Route path="/account/sub" component={Subaccount} />
                    <Route path="/account/webset" component={Webset} />
                    <Route path="/account/role" component={Role} />
                    <Route path="/account/Build" component={Build} />
                    <Route path="/account/halluser" component={Halluser} />
                    <Route path="/account/gameid" component={Gameid} />
                    {/*<Route path="/account/sub" component={router.subaccount} />*/}
                    <Route path="/market/hallcost" component={HallCost} />
                    <Route path="/operation/review" component={Review} />
                    <Route path="/operation/operation" component={Operation} />
                    <Route path="/setting/game" component={Game} />

                    <Route path="/report/periods" component={Periods} />
                    <Route path="/report/summary" component={Summary} />
                    <Route path="/report/gameReport" component={GameReport} />

                    <Route path="/cash/bank" component={Bank} />
                    <Route path="/cash/pay" component={Pay} />
                    <Route path="/cash/currency" component={Currency} />

                    <Route path="/setting/game" component={Game} />
                    <Route path="/setting/ipblacks" component={Ipblacks} />
                    <Route path="/setting/systemLog" component={Logs} />
                    <Route path="/setting/mtoken" component={Mtoken} />
                    <Route path="/thirdgame" component={router.thirdgame} />
                    <Route path="/notice/message" component={Message} />
                    <Route path="/notice/notice" component={Notice} />
                    <Route path="/risk/order" component={Order} />
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
