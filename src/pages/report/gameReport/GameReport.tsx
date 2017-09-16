import { Form, Tag } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import { Store } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { LangSiteState } from '../../lang.model';
import * as styles from './GameReport.less';
import { GameReportState, withGameReport } from './GameReport.model';
import { HallSimpleItem } from '../../account/hall/Hall';

@Form.create()
@withGameReport
export default class GameReport extends BasePage<GameReportProps, any> {
  constructor(props: GameReportProps) {
    const config: BasePageConfig = {
      ns: 'gameReport',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      canCreate: false,
      columns: [
        {
          title: '厅主账号',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '总投注笔数',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '总投注金额',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '总有效投注金额',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '总派奖金额',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '输赢',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '彩金',
          dataIndex: 'name',
          canForm: true,
        },
        {
          title: '贡献 ',
          dataIndex: 'name',
          canForm: true,
        },
      ],
      searchs: [
        {
          title: '游戏类型',
          dataIndex: 'game_id',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [
            {
              title: '彩票',
              value: '彩票',
            },
            {
              title: 'LEBO视讯',
              value: 'LEBO视讯',
            },
            {
              title: '体育',
              value: '体育',
            },
            {
              title: 'AG',
              value: 'AG',
            },
            {
              title: 'OG',
              value: 'OG',
            },
          ],
        },
        {
          title: '厅主账号',
          dataIndex: 't_id',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve()
            .then(() => this.actions.simpleList({ promise: true }))
            .then(data => ({
              list: data.simpleList.map((item: HallSimpleItem) => ({
                title: item.company_account,
                value: item.company_account,
              })),
            })),
        },
        {
          title: '开始时间',
          dataIndex: 'date_from',
          formType: FormType.DatePicker,
        },
        {
          title: '结束时间',
          dataIndex: 'date_to',
          formType: FormType.DatePicker,
        },
      ],
    };
    super(props, config);
  }
}

export interface GameReportProps extends BasePageProps {}
