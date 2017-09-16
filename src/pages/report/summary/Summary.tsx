import { Form } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withSummary } from './Summary.model';
import { HallSimpleItem } from '../../account/hall/Hall';

@Form.create()
@withSummary
export default class Summary extends BasePage<SummaryProps, any> {
  constructor(props: SummaryProps) {
    const config: BasePageConfig = {
      ns: 'summary',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      canCreate: false,
      columns: [
        {
          title: '厅主账号',
          dataIndex: 't_id',
        },
        {
          title: '公司名称',
          dataIndex: 't_company',
        },
        {
          title: '总投注笔数',
          dataIndex: 'bet_times',
        },
        {
          title: '总投注金额',
          dataIndex: 'bet_money',
        },
        {
          title: '总有效投注金额',
          dataIndex: 'valid_bet',
        },
        {
          title: '总派奖金额',
          dataIndex: 'send_prize',
        },
        {
          title: '输赢',
          dataIndex: 'lose_earn',
        },
        {
          title: '彩金',
          dataIndex: 'bonus',
        },
        {
          title: '贡献',
          dataIndex: 'contri',
        },
      ],
      searchs: [
        {
          title: '厅主账号',
          dataIndex: 't_id',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve()
            .then(() => this.actions.simpleList({ promise: true }))
            .then(data => ({
              list: data.simpleList.map((item: HallSimpleItem) => ({ title: item.company_account, id: item.id })),
            })),
        },
        {
          title: '时间',
          dataIndex: 'date_from,date_to',
          formType: FormType.DateRange,
        },
      ],
    };
    super(props, config);
  }
}

export interface SummaryProps extends BasePageProps {}
