import { Button, Form, Icon, Popconfirm, Switch } from 'antd';
import * as React from 'react';
import { datetime } from '../../../utils/date';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withIpblacks } from './Ipblacks.model';

@Form.create()
@withIpblacks
export default class Ipblacks extends BasePage<IpblacksProps, any> {
  constructor(props: IpblacksProps) {
    const config: BasePageConfig = {
      ns: 'ipblacks',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withStatus: false,
      rowSelection: true,
      withEdit: false,
      columns: [
        {
          title: 'ip',
          dataIndex: 'ip',
          canForm: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (text, record) => {
            return (
              <span>
                <Switch
                  checkedChildren="限制"
                  unCheckedChildren="允许"
                  onChange={checked => {
                    this.actions.save({ ids: [record.id], op: checked ? '1' : '0' });
                  }}
                  defaultChecked={Boolean(Number(text))}
                />
              </span>
            );
          },
          canForm: true,
          formType: FormType.Switch,
          labels: ['限制', '允许'],
          values: ['0', '1'],
        },
        {
          title: '拦截次数',
          dataIndex: 'intercept',
        },
        {
          title: '建立时间',
          dataIndex: 'created',
          render: (text: any) => datetime(text),
        },
        {
          title: '最后修改时间',
          dataIndex: 'updated',
          render: (text: any) => datetime(text),
        },
        {
          title: '备注',
          dataIndex: 'memo',
          canForm: true,
        },
      ],
      searchs: [
        {
          title: 'IP',
          dataIndex: 'ip',
        },
        {
          title: '状态',
          dataIndex: 'status',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve().then(v => ({
            list: [{ id: 0, title: '允许' }, { id: 1, title: '限制' }],
          })),
        },
        {
          title: '建立时间',
          dataIndex: 'date_from',
          formType: FormType.DatePicker,
        },
        {
          title: '结束时间',
          dataIndex: 'date_to',
          formType: FormType.DatePicker,
        },
      ],
      actions: [
        {
          label: '删除',
          onClick: record => {
            props.dispatch({ type: 'ipblacks/deleteBatch', payload: { ids: record.id } });
          },
          render: record => (
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={e => {
                this.props.dispatch({ type: 'ipblacks/deleteBatch', payload: { ids: record.id } });
              }}
            >
              <a>{this.props.site.删除}</a>
            </Popconfirm>
          ),
        },
      ],
    };
    super(props, config);
    this.footer = () => (
      <div>
        <Popconfirm
          title="确定要批量删除吗？"
          onConfirm={e => {
            this.props.dispatch({
              type: 'ipblacks/deleteBatch',
              payload: { ids: this.state.selectedRowKeys.join(',') },
            });
          }}
        >
          <Button
            type="primary"
            loading={this.props.loading}
            disabled={!(this.state.selectedRowKeys.length > 0)}
            style={{ marginRight: 15 }}
          >
            <Icon type="file" />批量删除
          </Button>
        </Popconfirm>
        <Button
          type="primary"
          loading={this.props.loading}
          disabled={!(this.state.selectedRowKeys.length > 0)}
          onClick={this.rowSlecallow}
          style={{ marginRight: 15 }}
        >
          <Icon type="file" />批量允许
        </Button>
        <Button
          type="primary"
          loading={this.props.loading}
          disabled={!(this.state.selectedRowKeys.length > 0)}
          onClick={this.rowSlecdeny}
          style={{ marginRight: 15 }}
        >
          <Icon type="file" />批量禁止
        </Button>
      </div>
    );
  }
}

export interface IpblacksProps extends BasePageProps {}
