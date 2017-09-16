import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';

import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { LangSiteState } from '../../lang.model';
import { CurrencyState, withCurrency } from './Currency.model';

@withCurrency
@Form.create()
export default class Currency extends BasePage<CurrencyProps, any> {
  constructor(props: CurrencyProps) {
    const config: BasePageConfig = {
      ns: 'currency',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      canCreate: false,
      withOperator: false,
      withStatus: false,
      columns: [
        {
          title: '货币代码',
          dataIndex: 'id',
          canForm: true,
        },
        {
          title: '货币名称',
          dataIndex: 'ctype',
          canForm: true,
        },
      ],
      searchs: [],
    };
    super(props, config);
  }
}

export interface CurrencyProps extends BasePageProps {}
