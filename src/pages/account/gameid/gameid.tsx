import { Tabs } from 'antd';

import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as style from '../gameid/gameid.less';
import GameList from './gamelist';
import { GameidState, withGameid } from './gameid.model';
import { BasePageProps } from '../../abstract/BasePage';
const TabPane = Tabs.TabPane;

@withGameid
export default class Gameid extends React.PureComponent<GameidProps, any> {
  private actions: any;
  render() {
    return (
      <div className={style.gameid}>
        <div className={style.title}>
          <div>游戏账号管理</div>
        </div>
        <div>
          <Tabs>
            {this.props.name.map((btn: any, i: number) => (
              <TabPane tab={<span>{btn.name}</span>} key={i}>
                {this.content(btn.name, btn.id)}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  private content = (name: any, id: any) => {
    return <GameList value={id} />;
  };
  public componentDidMount() {
    this.actions.names({});
  }
}

interface GameidProps extends Partial<GameidState>, BasePageProps {}
