import { Form, Popconfirm } from 'antd';

import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { GameidState, withGameid } from './gameid.model';
import { HallSimpleItem } from '../hall/Hall';

@withGameid
@Form.create()
export default class GameList extends BasePage<GameListProps, any> {
  constructor(props: GameListProps) {
    const companyAccountPromise = props.dispatch({ type: 'hall/simpleList', promise: true }).then(data => ({
      list: data.simpleList.map((item: HallSimpleItem) => ({
        title: item.company_account,
        value: item.id,
      })),
    }));

    const config: BasePageConfig = {
      ns: 'gameid',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,

      withDelete: false,
      withStatus: false,
      columns: [
        {
          title: '游戏',
          dataIndex: 'partner_id',
          formType: FormType.Select,
          canForm: true,
          canShow: false,
          otherData: 'partner_name',
          dataSource: props.name,
        },
        {
          title: '游戏',
          dataIndex: 'partner_name',
          formType: FormType.Hidden,
          canForm: true,
          canShow: false,
        },

        {
          title: '厅主',
          dataIndex: 'hall_account',
          formType: FormType.Hidden,
          canForm: true,
          canShow: true,
        },
        {
          title: '厅主',
          dataIndex: 'hall_id',
          formType: FormType.Select,
          canForm: true,
          canShow: false,
          otherData: 'hall_account',
          dataSource: companyAccountPromise,
        },

        {
          title: 'API账号',
          dataIndex: 'api_account',
          canForm: true,
        },
        {
          title: 'API密码',
          dataIndex: 'api_password',
          canForm: true,
        },
        {
          title: '登陆账号',
          dataIndex: 'admin_account',
          canForm: true,
        },
        {
          title: '登陆密码',
          dataIndex: 'admin_password',
          canForm: true,
        },
        {
          title: 'API key',
          dataIndex: 'api_key',
          canForm: true,
        },
      ],
      actions: [
        {
          label: '删除',
          onClick: record => {
            props.dispatch({ type: 'gameid/remove', payload: { id: record.id } });
          },
          render: record => (
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={e => {
                this.props.dispatch({ type: 'gameid/remove', payload: { id: record.id } });
              }}
            >
              <a>{this.props.site.删除}</a>
            </Popconfirm>
          ),
        },
      ],
    };
    super(props, config);
  }
  public componentDidMount() {
    if (this.props.value) {
      this.props.dispatch({ type: 'gameid/query', payload: { partner_id: this.props.value } });
    }
  }
}

export interface GameListProps extends Partial<GameidState>, BasePageProps {
  value?: any;
}
