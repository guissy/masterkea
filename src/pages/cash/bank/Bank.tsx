import { Form } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withBank } from './Bank.model';

@Form.create()
@withBank
export default class Bank extends BasePage<BankProps, any> {
  constructor(props: BankProps) {
    const config: BasePageConfig = {
      ns: 'bank',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withOperator: false,
      canCreate: false,
      columns: [
        {
          title: '银行代码',
          dataIndex: 'code',
          canForm: true,
        },
        {
          title: '银行名称',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '银行简称',
          dataIndex: 'shortname',
          canForm: true,
        },
        {
          title: 'LOGO',
          dataIndex: 'logo',
          canForm: true,
          formType: FormType.UploadImage,
          render: (val, { logo }) => <img src={logo} />,
        },
        {
          title: '建立人',
          dataIndex: 'creator',
        },
        {
          title: '建立时间',
          dataIndex: 'created',
        },
        {
          title: '最新修改人',
          dataIndex: 'updated_name',
        },
        {
          title: '修改时间',
          dataIndex: 'updated',
        },
      ],
      searchs: [
        {
          title: '银行名称',
          dataIndex: 'bank_name',
        },
      ],
    };
    super(props, config);
  }
}

export interface BankProps extends BasePageProps {}
