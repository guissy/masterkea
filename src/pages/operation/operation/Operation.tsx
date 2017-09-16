import { Form, Switch } from 'antd';

import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import OperationDetail from './Operation.detail';
import * as styles from './Operation.less';
import { withOperation } from './Operation.model';
import { HallSimpleItem } from '../../account/hall/Hall';

@withOperation
@Form.create()
export default class Operation extends BasePage<OperationProps, any> {
  constructor(props: OperationProps) {
    const config: BasePageConfig = {
      ns: 'operation',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withOperator: false,
      afterComponent: () => (
        <OperationDetail
          data={this.props.operation.info}
          visibleDetail={this.state.visibleDetail}
          onClose={() => {
            this.setState({ visibleDetail: false });
          }}
        />
      ),
      footer: () => (
        <p>
          小计：{this.props.operation.attributes.page_sum}
          <span className={styles.splite} />
          总计：{this.props.operation.attributes.total_sum}
        </p>
      ),
      withDelete: false,
      canCreate: false,
      columns: [
        {
          title: '厅主账号',
          dataIndex: 'company_account',
        },
        {
          title: '厅主名称',
          dataIndex: 'company_name',
        },
        {
          title: '期数',
          dataIndex: 'period_number',
        },
        {
          title: '实收金额',
          dataIndex: 'receipts',
          render: (val, { id }) => (
            <a
              onClick={() => {
                this.setState({ visibleDetail: true });
                this.props.dispatch({ type: 'operation/info', payload: { id } });
              }}
            >
              {val}
            </a>
          ),
        },
        {
          title: '付款状态',
          dataIndex: 'status',
          render: (text, record) => {
            return (
              <span>
                <Switch
                  checkedChildren="已支付"
                  unCheckedChildren="未支付"
                  onChange={checked => {
                    this.props.dispatch({
                      type: 'operation/infoOp',
                      payload: { id: record.id, status: checked ? '1' : '0' },
                    });
                  }}
                  defaultChecked={Boolean(Number(text))}
                />
              </span>
            );
          },
          labels: ['已支付', '未支付'],
          values: ['1', '0'],
        },
      ],
      searchs: [
        {
          title: '期数',
          dataIndex: 'period_number',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: props.dispatch({ type: 'periods/periods', promise: true }).then(data => ({
            list: data.periods.map((item: any) => ({ title: item as string, value: String(item) })),
          })),
        },
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: props.dispatch({ type: 'hall/simpleList', promise: true }).then(data => ({
            list: data.simpleList.map((item: HallSimpleItem) => ({
              title: item.company_account,
              value: item.company_account,
            })),
          })),
        },
        {
          title: '付款状态',
          dataIndex: 'status',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve().then(v => ({
            list: [{ title: '未付款', id: 0 }, { title: '已付款', id: 1 }],
          })),
        },
      ],
    };
    super(props, config);
    this.state.visibleDetail = false;
    this.state.item = { info: {}, items: [] };
  }
}

export interface OperationProps extends BasePageProps {}
