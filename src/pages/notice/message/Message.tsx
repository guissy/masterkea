import { Alert, Form, Modal } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { datetime } from '../../../utils/date';
import { default as BaseModel } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withLang } from '../../lang.model';
// import 'Message.css';
import MessageView from './MessageView';
import createWith from '../../../utils/buildKea';
import * as service from './Message.service';
import { withHallList } from '../../account/hall/Hall.model.pk';
// 虽然这里import了，但是组件没import呢？可以使用了懒加载的原因

const model = new BaseModel('message', { itemName: '' }, service);
model.addEffect('sender');

@Form.create()
@createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    simpleList: withHallList,
  },
})
export default class Message extends BasePage<MessageProps, any> {
  constructor(props: MessageProps) {
    const config: BasePageConfig = {
      ns: 'message',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      createOkText: '发送',
      createBtnName: '给所有厅主发消息',
      withDelete: true,
      withEdit: true,
      withStatus: false,
      onRowClick: (editingItem, index, event) => {
        if (!event.target.className.includes('ant-') && !event.target.closest('td:last-child')) {
          this.setState({ editingItem, isShowView: true });
        }
      },
      columns: [
        {
          title: '消息标题',
          dataIndex: 'title',
          canForm: true,
          maxLength: 25,
        },
        {
          title: '内容',
          dataIndex: 'content',
          canForm: true,
          canShow: false,
          formType: FormType.TextArea,
          formClassName: 'textArea',
        },
        {
          title: '发送人',
          dataIndex: 'admin',
        },
        {
          title: '接收厅主',
          dataIndex: 'recipient',
        },
        {
          title: '发送时间',
          dataIndex: 'updated',
          render: (text: any) => datetime(text),
        },
        {
          title: '发送状态',
          dataIndex: 'status',
          render: (text, record) => {
            return <span>{!!text ? '已发送' : '未发送'}</span>;
          },
        },
      ],
      searchs: [
        {
          title: '发送人',
          dataIndex: 'admin_id',
          formType: FormType.Select,
          initialValue: '全部',
          // dataSource: props.dispatch({ type: 'message/sender', promise: true }).then(v => ({ list: v.sender })),
          dataSource: Promise.resolve()
            .then(() => this.actions.sender({ promise: true }))
            .then(v => ({ list: v.sender })),
        },
        {
          title: '接收厅主',
          dataIndex: 'recipient',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve().then(() =>
            this.actions.simpleList({ promise: true }).then(v => ({
              list: v.simpleList.map((w: any) => ({ name: w.company_account, id: w.id })),
            }))
          ),
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
    };
    super(props, config);
    this.state = {
      ...this.state,
      isShowView: false,
    };
    this.afterComponent = this.getViewComponent.bind(this);
    this.onOkView = this.onOkView.bind(this);
    this.onCancelView = this.onCancelView.bind(this);
  }

  private getViewComponent() {
    const { site } = this.props;
    return (
      <div>
        <Alert
          message={
            <span>
              {' '}
              点击<Link to="/account/hall">这里</Link>给指定厅主发消息{' '}
            </span>
          }
          banner={true}
          type="info"
        />
        <Modal
          key="update"
          title={site.查看消息}
          visible={this.state.isShowView}
          onCancel={this.onCancelView}
          onOk={this.onOkView}
          footer={null}
        >
          <MessageView viewItem={this.state.editingItem} />
        </Modal>
      </div>
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

export interface MessageProps extends BasePageProps {}
