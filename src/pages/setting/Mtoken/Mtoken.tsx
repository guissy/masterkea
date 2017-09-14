import { Form, Switch } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { connect } from 'dva';
import * as React from 'react';
import { Store } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { HallSimpleItem } from '../../account/hall/Hall.model';
import { LangSiteState } from '../../lang.model';
import * as styles from './Mtoken.less';
import { MtokenState } from './Mtoken.model';

@connect(({ mtoken, lang }: Store) => ({ mtoken, site: lang.site }))
@Form.create()
export default class Mtoken extends BasePage<MtokenProps, any> {
  constructor(props: MtokenProps) {
    const companyAccountPromise = props.dispatch({ type: 'hall/simpleList', promise: true }).then(data => ({
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

export interface MtokenProps extends ReduxProps, LangSiteState {
  form?: WrappedFormUtils;
  mtoken?: MtokenState;
}
