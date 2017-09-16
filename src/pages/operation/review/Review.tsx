import { Form } from 'antd';

import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import ReviewDetail from './Review.detail';
import { withReview } from './Review.model';
import ReviewTag from './Review.tag';

@withReview
@Form.create()
export default class Review extends BasePage<ReviewProps, any> {
  private info: any; // 详情
  constructor(props: ReviewProps) {
    const config: BasePageConfig = {
      ns: 'review',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      canCreate: false,
      withEdit: false,
      withStatus: false,
      afterComponent: () =>
        <ReviewDetail
          data={{ ...this.info, ...this.props.review.info[0] }}
          visibleDetail={this.state.visibleDetail}
          onStatus={(id, status) => {
            const labels = ['通过', '拒绝'];
            this.actions.status({ id, labels, status });
            this.setState({ visibleDetail: false });
          }}
          onClose={() => {
            this.setState({ visibleDetail: false });
          }}
        />,
      columns: [
        {
          title: '厅主名称',
          dataIndex: 'company_name',
        },
        {
          title: '厅主账号',
          dataIndex: 'company_account',
        },
        {
          title: '申请时间',
          dataIndex: 'apply_time',
        },
        {
          title: '申请人',
          dataIndex: 'apply_user',
        },
        {
          title: '处理人',
          dataIndex: 'process_user',
        },
        {
          title: '处理时间',
          dataIndex: 'process_time',
        },
        {
          title: '申请内容',
          dataIndex: 'contnet',
          render: (text: any, { id, ...info }) =>
            <a
              onClick={() => {
                this.info = info;
                this.props.dispatch({ type: 'review/info', payload: { id } });
                this.setState({ visibleDetail: true });
              }}
            >
              详情
            </a>,
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: val => <ReviewTag val={val} />,
        },
      ],
      actions: [
        {
          label: '通过',
          disabled: ({ status }) => status === 'pass',
          onClick: ({ id }) => {
            const labels = ['通过', '拒绝'];
            this.props.dispatch({ type: 'review/status', payload: { id, labels, status: 'pass' } });
          },
        },
        {
          label: '拒绝',
          disabled: ({ status }) => status === 'rejected',
          onClick: ({ id }) => {
            const labels = ['通过', '拒绝'];
            this.props.dispatch({ type: 'review/status', payload: { id, labels, status: 'rejected' } });
          },
        },
      ],
    };
    super(props, config);
  }
}

export interface ReviewProps extends BasePageProps {
}
