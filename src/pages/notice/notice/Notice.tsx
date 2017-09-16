import { Form, Modal } from 'antd';
import * as React from 'react';
import { datetime } from '../../../utils/date';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import NoticeDetail from './Notice.detail';
import { withNotice } from './Notice.model';

@Form.create()
@withNotice
export default class Notice extends BasePage<NoticeProps, any> {
  constructor(props: NoticeProps) {
    const noticeTypePromise = Promise.resolve()
      .then(() => this.actions.type({ promise: true }))
      .then(v => ({ list: v.type }));
    const config: BasePageConfig = {
      ns: 'notice',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      onRowClick: (editingItem, index, event) => {
        if (!event.target.className.includes('ant-') && !event.target.closest('td:last-child')) {
          this.setState({ editingItem, isShowView: true });
        }
      },
      columns: [
        {
          title: '公告类型',
          dataIndex: 'game_type',
          canForm: true,
          formType: FormType.Select,
          dataSource: noticeTypePromise,
        },
        {
          title: '公告标题',
          dataIndex: 'title',
          canForm: true,
          maxLength: 100,
        },
        {
          title: '语言',
          dataIndex: 'language',
          canForm: true,
          formType: FormType.Select,
          dataSource: Promise.resolve()
            .then(() => this.actions.langList({ promise: true }))
            .then(v => ({ list: v.langList })),
        },
        {
          title: '内容',
          dataIndex: 'content',
          canForm: true,
          formType: FormType.TextArea,
        },
        {
          title: '显示方式',
          dataIndex: 'display',
          canShow: false,
          canForm: false,
          required: false,
          formType: FormType.Checkbox,
          content: '打开游戏页面弹窗',
        },
        {
          title: '生效时间',
          dataIndex: 'start_time',
          // canShow: false,
          canForm: true,
          required: false,
          formType: FormType.DatePicker,
          render: (text: any) => datetime(text),
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          // canShow: false,
          canForm: true,
          required: false,
          formType: FormType.DatePicker,
          render: (text: any) => datetime(text),
        },
        {
          title: '发布者',
          dataIndex: 'admin',
        },
        {
          title: '状态',
          dataIndex: 'status',
          canForm: true,
          required: false,
          formType: FormType.Switch,
          labels: ['已发布', '未发布'],
        },
        {
          title: '建立时间',
          dataIndex: 'updated',
          render: (text: any) => datetime(text),
        },
      ],
      actions: [
        {
          label: '查看',
          onClick: editingItem => {
            this.setState({ editingItem, isShowView: true });
          },
        },
      ],
      searchs: [
        // TODO 以后可能会要做标题和内容的搜索
        {
          title: '公告类型',
          dataIndex: 'type_id',
          formType: FormType.Select,
          dataSource: noticeTypePromise,
        },
      ],
    };
    super(props, config);
    this.afterComponent = this.getViewComponent.bind(this);
    this.onOkView = this.onOkView.bind(this);
    this.onCancelView = this.onCancelView.bind(this);
  }

  private getViewComponent() {
    const { site } = this.props;
    return (
      <Modal
        key="update"
        title={site.查看公告}
        visible={this.state.isShowView}
        onCancel={this.onCancelView}
        onOk={this.onOkView}
        footer={null}
      >
        <NoticeDetail viewItem={this.state.editingItem} />
      </Modal>
    );
  }

  private onOkView() {
    this.setState({
      isShowView: true,
    });
  }

  private onCancelView() {
    this.setState({
      isShowView: false,
    });
  }
}

export interface NoticeProps extends BasePageProps {}
