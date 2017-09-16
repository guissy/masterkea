import { Form } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withHalluser } from './Halluser.model';

@Form.create()
@withHalluser
export default class Halluser extends BasePage<HalluserProps, any> {
  constructor(props: HalluserProps) {
    const config: BasePageConfig = {
      ns: 'halluser',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withEdit: false,
      withStatus: false,
      canCreate: false,
      emptyText: '暂无数据，建议更换账号名称或IP关键字，再试一试！',
      columns: [
        {
          title: '所属厅主',
          dataIndex: 'hall_name',
        },
        {
          title: '账号',
          dataIndex: 'name',
        },
        {
          title: 'IP',
          dataIndex: 'login_ip',
        },
        {
          title: '登录时间',
          dataIndex: 'last_login',
        },
      ],
      searchs: [
        {
          title: '体系',
          dataIndex: 'type',
          formType: FormType.Select,
          initialValue: '1',
          dataSource: Promise.resolve({
            list: [{ title: '会员', value: '1' }, { title: '代理', value: '2' }],
          }),
        },
        {
          title: '账号',
          dataIndex: 'account',
        },
        {
          title: 'IP',
          dataIndex: 'ip',
        },
        {
          title: '日期',
          dataIndex: 'start_time,end_time',
          formType: FormType.DateRange,
        },
      ],
    };
    super(props, config);
  }

  public componentDidMount() {
    // 覆盖父级的查询
  }
}

export interface HalluserProps extends BasePageProps {}
