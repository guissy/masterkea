import { Form, Tag } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { datetime } from '../../../utils/date';
import { withOrder } from './Order.model';
import { HallSimpleItem } from '../../account/hall/Hall';

enum OrderType {
  彩票注单 = 1,
  存款单 = 2,
  取款单 = 3,
}

@Form.create()
@withOrder
export default class Order extends BasePage<OrderProps, any> {
  constructor(props: OrderProps) {
    const config: BasePageConfig = {
      ns: 'order',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withStatus: false,
      withEdit: false,
      canCreate: false,
      columns: [
        {
          title: '厅主名称',
          dataIndex: 'company_name',
          canForm: false,
        },
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          canForm: false,
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
          canForm: false,
        },
        {
          title: '订单类型',
          dataIndex: 'type',
          render: (val: OrderType) => OrderType[val],
          // "type": "int #类型，1 彩票注单，2 存款单， 3 取款单",
          canForm: false,
        },
        {
          title: '订单号',
          dataIndex: 'order_id',
          canForm: false,
        },
        {
          title: '订单创建时间',
          dataIndex: 'created',
          render: (text: any) => datetime(text),
          canForm: false,
        },
        {
          title: '备注',
          dataIndex: 'comment',
          canForm: false,
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: text => {
            // "state": "int #订单状态，1 异常，2 正常"
            let elm;
            switch (String(text)) {
              case '1':
                elm = (
                  <Tag key={text} color="#f50">
                    异常
                  </Tag>
                );
                break;
              case '2':
                elm = (
                  <Tag key={text} color="#87d068">
                    正常
                  </Tag>
                );
                break;
            }
            return elm;
          },
          canForm: false,
        },
      ],
      searchs: [
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve()
            .then(() => this.actions.simpleList({ promise: true }))
            .then(data => ({
              list: data.simpleList.map((item: HallSimpleItem) => ({
                title: item.company_account,
                id: item.id,
              })),
            })),
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
        },
        {
          title: '订单号',
          dataIndex: 'order_id',
        },
        {
          title: '订单类型',
          dataIndex: 'type',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Object.keys(OrderType)
            .filter(v => isNaN(Number(v)))
            .map((v: string) => ({ title: v, value: String(OrderType[v as any]) })),
        },
        {
          title: '状态',
          dataIndex: 'state',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [{ title: '异常', value: '1' }, { title: '正常', value: '2' }],
        },
      ],
      actions: [
        {
          label: '标记为正常',
          hidden: ({ status }) => status === '1',
          onClick: ({ order_id }) => {
            const labels = ['正常', '异常'];
            this.props.dispatch({ type: 'order/status', payload: { labels, ids: [order_id] } });
          },
        },
      ],
    };
    super(props, config);
  }
}

export interface OrderProps extends BasePageProps {}
