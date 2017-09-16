import { Form, Modal, Tag } from 'antd';
import * as React from 'react';
import { datetime } from '../../../utils/date';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import { HallSimpleItem } from '../hall/Hall';
import WebsetEdit from './Webset.edit';
import WebsetMarkdown from './WebsetMarkdown';
import { withWebset } from './Webset.model';

@Form.create()
@withWebset
export default class Webset extends BasePage<WebsetProps, any> {
  constructor(props: WebsetProps) {
    const companyAccountPromise = Promise.resolve()
      .then(() => this.actions.simpleList({ promise: true }))
      .then(data => ({
        list: data.simpleList.map((item: HallSimpleItem) => ({ title: item.company_account, id: item.id })),
      }));
    const config: BasePageConfig = {
      ns: 'webset',
      createComponent: WebsetEdit,
      updateComponent: WebsetEdit,
      withDelete: false,
      withStatus: false,
      modalWidth: Math.min(window.innerWidth - 100, 1200),
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          canForm: true,
        },
        {
          title: '主目录',
          dataIndex: 'sites',
          canForm: true,
        },
        {
          title: '标识域名',
          dataIndex: 'domain',
          canForm: true,
        },
        {
          title: '负载级别',
          dataIndex: 'level',
          render: (val, { name, level, threshold_number }) => `${name} ( ${level} 级 ${threshold_number / 10000}万/ 人)`,
        },
        {
          title: '占用状态',
          dataIndex: 'occupy',
          // filter: ['state', '状态'],
          render: text => {
            let elm;
            switch (text) {
              case '1':
                elm = (
                  <Tag key={text} color="#f50">
                    已占用
                  </Tag>
                );
                break;
              case '0':
                elm = (
                  <Tag key={text} color="#2db7f5">
                    未占用
                  </Tag>
                );
                break;
            }
            return elm;
          },
        },
        {
          title: '创建时间',
          dataIndex: 'created',
          // filter: ['state', '状态'],
          render: text => datetime(text),
        },
        {
          title: '更新时间',
          dataIndex: 'updated',
          // filter: ['state', '状态'],
          render: text => datetime(text),
        },
      ],
      searchs: [
        {
          title: '厅主账号',
          dataIndex: 'hall_id',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: companyAccountPromise,
        },
      ],
      actions: [
        {
          label: '手册',
          onClick: ({ id, domain }) => {
            this.setState({ id, domain, isEditingDocument: true });
          },
        },
      ],
    };
    super(props, config);
    this.afterComponent = this.getViewComponent.bind(this);
    this.state.domain = '';
  }

  private getViewComponent() {
    return (
      <Modal
        key={'document' + this.state.id}
        title="配置手册"
        visible={this.state.isEditingDocument}
        okText="关闭"
        onOk={this.onCancelView.bind(this, 'isEditingDocument')}
        onCancel={this.onCancelView.bind(this, 'isEditingDocument')}
        width={800}
      >
        <WebsetMarkdown id={this.state.id} domain={this.state.domain} />
      </Modal>
    );
  }

  private onCancelView(key: string) {
    this.setState({
      [key]: false,
    });
  }

  private onCopy(text: string) {
    const textArea = document.createElement('textarea');
    try {
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'success', message: '复制成功' } });
      } else {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
      }
    } catch (err) {
      this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export interface WebsetProps extends BasePageProps {}
