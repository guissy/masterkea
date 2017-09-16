import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';

import * as React from 'react';
import { Store } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { LangSiteState } from '../../lang.model';
import { PayState, withPay } from './Pay.model';

@withPay
@Form.create()
export default class Pay extends BasePage<PayProps, any> {
  constructor(props: PayProps) {
    const config: BasePageConfig = {
      ns: 'pay',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withOperator: false,
      canCreate: false,
      columns: [
        {
          title: '支付渠道',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '支付接口名称',
          dataIndex: 'pay_name',
          canForm: true,
        },
        {
          title: '图片LOGO',
          dataIndex: 'logo',
          canForm: true,
          formType: FormType.UploadImage,
          render: val => <img src={val} />,
        },
        {
          title: '通知URL',
          dataIndex: 'url_notify',
          canForm: true,
        },
        {
          title: '确认URL',
          dataIndex: 'url_return',
          canForm: true,
        },
        {
          title: '描述',
          dataIndex: 'description',
          canForm: true,
          formType: FormType.TextArea,
          required: false,
        },
      ],
      searchs: [
        {
          title: '支付平台',
          dataIndex: 'name',
        },
      ],
    };
    super(props, config);
  }
}

export interface PayProps extends BasePageProps {}
