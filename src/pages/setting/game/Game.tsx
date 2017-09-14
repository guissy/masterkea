import { Form, DatePicker, Switch } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as moment from 'moment';
import * as React from 'react';
import { datetime } from '../../../utils/date';
import { Store } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { LangSiteState } from '../../lang.model';
import * as styles from './Game.less';
import { GameState, withGame } from './Game.model';
import MaintainForm from './MaintainForm';

@withGame
class Game extends BasePage<GameProps, any> {
  constructor(props: GameProps) {
    const config: BasePageConfig = {
      ns: 'game',
      withOperator: false,
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withStatus: false,
      // canCreate: false,

      columns: [
        // {
        //   title: 'ID',
        //   dataIndex: 'id',
        // },
        {
          title: '游戏平台名称',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '游戏类型',
          dataIndex: 'live,game,sport',
          render: (text, record) => {
            const types = [];
            if (record.live == 1) {
              types.push('视讯');
            }
            if (record.game == 1) {
              types.push('电子游艺');
            }
            if (record.sport == 1) {
              types.push('体育');
            }
            return types.join(' ');
          },
          formType: FormType.checktype,
          otherData: ['视讯', '电子游艺', '体育'],
          canForm: true,
        },
        {
          title: '后台地址',
          dataIndex: 'admin_url',
          canForm: true,
          formType: FormType.url,
        },
        // {
        //   title: 'API账户ID',
        //   dataIndex: 'account',
        //   canForm: true,
        // },
        // {
        //   title: 'API账户key',
        //   dataIndex: 'key',
        //   canForm: true,
        // },
        // {
        //   title: 'API URL',
        //   dataIndex: 'url',
        //   canForm: true,
        //   formType: FormType.url,
        // },
        // {
        //   title: '最后同步时间',
        //   dataIndex: 'syntime',
        //   render: (text, record) => datetime(text),
        // },
        {
          title: '最后操作者',
          dataIndex: 'admin',
        },
        {
          title: '最后修改时间',
          dataIndex: 'updated',
          render: (text, record) => datetime(text),
        },
        {
          title: '维护状态',
          dataIndex: 'status',
          canForm: true,
          render: (text, record) =>
            <span>
              <Switch
                checkedChildren="开放中"
                unCheckedChildren="维护中"
                onChange={checked => {
                  this.props.dispatch({
                    type: 'game/status',
                    payload: { id: record.id, status: checked ? '1' : '0' },
                  });
                }}
                defaultChecked={Boolean(Number(text))}
              />
            </span>,
          formType: FormType.Switch,
          labels: ['开放中', '维护中'],
          values: ['1', '0'],
        },
        {
          title: '维护开始时间',
          dataIndex: 'maintain_start',
          render: (text: any, record: any) =>
            <DatePicker
              onOk={Moment => this.onStrt(Moment, record)}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              value={text == 0 ? null : moment(text * 1000)}
            />,
        },
        {
          title: '维护结束时间',
          dataIndex: 'maintain_end',
          render: (text: any, record: any) =>
            <DatePicker
              onOk={Moment => this.onblur(Moment, record)}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              value={text == 0 ? null : moment(text * 1000)}
            />,
        },
        /*   {
                 title: '状态',
                 dataIndex: 'status',
                 canForm: true,
                 formType: FormType.Switch,
                 },*/
      ],
      /*   searchs: [],
             actions: [
             // {
             //   label: '同步',
             //   onClick: ({ id }) => {
             //     this.props.dispatch({ type: 'game/sync', payload: { id } });
             //   },
             // },
             {
             label: '维护',
             onClick: record => {
             this.setState({
             id: record.id,
             });
             this.props.dispatch({
             type: 'game/statusSuccess',
             payload: {
             maintainVisible: true,
             },
             });
             },
             },
             ],*/
    };
    super(props, config);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.afterComponent = this.getViewComponent.bind(this);
    this.state.starttime = '';
    this.state.endtime = '';
  }

  private toggleStatus(data: any) {
    this.props.dispatch({
      type: 'game/toggleStatus',
      payload: data,
    });
  }

  private getViewComponent() {
    return <MaintainForm visible={this.props.maintainVisible} id={this.state.id} />;
  }

  private onblur(moment: moment.Moment, record: any) {
    this.props.dispatch({
      type: 'game/maintain',
      payload: { end_time: moment.unix(), id: record.id },
    });
  }

  private onStrt(moment: moment.Moment, record: any) {
    this.props.dispatch({
      type: 'game/maintain',
      payload: { start_time: moment.unix(), id: record.id },
    });
  }
}

export default Form.create()(Game);

export interface GameProps extends BasePageProps, GameState {
}
