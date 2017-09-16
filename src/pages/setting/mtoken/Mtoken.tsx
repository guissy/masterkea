import { Form, Switch } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withMtoken } from './Mtoken.model';
import { HallSimpleItem } from '../../account/hall/Hall';

@Form.create()
@withMtoken
export default class Mtoken extends BasePage<MtokenProps, any> {
  constructor(props: MtokenProps) {
    const companyAccountPromise = Promise.resolve()
      .then(() => this.actions.simpleList({ promise: true }))
      .then(data => ({
      list: data.simpleList.map((item: HallSimpleItem) => ({
        title: item.company_account,
        value: item.company_account,
      })),
    }));
    const config: BasePageConfig = {
      ns: 'mtoken',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,

      withDelete: false,
      withStatus: false,
      columns: [
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          formType: FormType.Select,
          canForm: true,
          dataSource: companyAccountPromise,
        },
        {
          title: 'M令牌账号',
          dataIndex: 'opt_account',
          canForm: true,
        },
        {
          title: 'M令牌密码',
          dataIndex: 'opt_password',
          canForm: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (text, record) => {
            return (
              <span>
                <Switch
                  checkedChildren="允许"
                  unCheckedChildren="限制"
                  onChange={checked => {
                    this.props.dispatch({
                      type: 'mtoken/status',
                      payload: { id: record.id, status: checked ? 'enable' : 'disable' },
                    });
                  }}
                  defaultChecked={text === 'enable' ? true : false}
                />
              </span>
            );
          },
          canForm: true,
          formType: FormType.Switch,
          labels: ['允许', '限制'],
          values: ['enable', 'disable'],
        },
      ],
      searchs: [
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: companyAccountPromise,
        },
      ],
    };
    super(props, config);
  }
}

export interface MtokenProps extends BasePageProps {
}
