import { Form } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { LangSiteState } from '../../lang.model';
import { withPeriods } from './Periods.model';

@Form.create()
@withPeriods
export default class Periods extends BasePage<PeriodsProps, any> {
  constructor(props: PeriodsProps) {
    const config: BasePageConfig = {
      ns: 'periods',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withOperator: false,
      withStatus: false,
      columns: [
        {
          title: '期数',
          dataIndex: 'number',
        },
        {
          title: '起始日期',
          dataIndex: 'start_date',
        },
        {
          title: '结束日期',
          dataIndex: 'end_date',
        },
        {
          title: '年份',
          dataIndex: 'year',
          canShow: false,
          canForm: true,
          formType: FormType.RadioButton,
          dataSource: Promise.resolve().then(v => ({
            list: [
              { id: 2017, title: '2017' },
              { id: 2018, title: '2018' },
              { id: 2019, title: '2019' },
              { id: 2020, title: '2020' },
              { id: 2021, title: '2021' },
              { id: 2022, title: '2022' },
              { id: 2023, title: '2023' },
              { id: 2024, title: '2024' },
              { id: 2025, title: '2025' },
              { id: 2026, title: '2026' },
              { id: 2027, title: '2027' },
              { id: 2028, title: '2028' },
              { id: 2029, title: '2029' },
              { id: 2030, title: '2030' },
              { id: 2031, title: '2031' },
              { id: 2032, title: '2032' },
              { id: 2033, title: '2033' },
              { id: 2034, title: '2034' },
              { id: 2035, title: '2035' },
              { id: 2036, title: '2036' },
            ],
          })),
        },
      ],
      searchs: [],
    };
    super(props, config);
  }
}

export interface PeriodsProps extends BasePageProps {}
