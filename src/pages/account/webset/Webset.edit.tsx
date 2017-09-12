import { Button, Checkbox, Form, Icon, Input, message, Select, Table, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { isEqual } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import buildRowKey from '../../../utils/buildRowKey';
import { Store } from '../../abstract/BaseModel';
import { LangSiteState } from '../../lang.model';
import * as styles from './Webset.less';
import WebsetTextarea from './Webset.textarea';

const storageNames = 'core,games,data,common,main,logs,redis,mongodb,rabbitmq'.split(',');

function getHostFastProps(this:WebsetEdit, editing: string, name: string, record: any, index: number, rules: any[], width: number) {
  return {
    name,
    record,
    index,
    rules,
    width,
    editing: this.state[editing],
    values: this.state.storage,
    form: this.props.form,
    nameToList: storageNames,
    parent: 'storage',
    nameTo: 'guid',
    onChange: (storage: any) => {
      this.setState({ storage });
    },
    onEditStatus: (editing0: boolean) => {
      if (editing0) {
        this.updateWidth.call(this);
      }
      this.setState({ [editing]: editing0 });
    },
  };
}

class WebsetEdit extends React.PureComponent<WebsetEditProps, any> {
  protected storageColumn: SiteColumn[];
  private hostNode: Table<any>;
  private hostWidths: number[] = [];
  private form: React.ReactInstance;

  constructor(props: WebsetEditProps) {
    super(props);
    this.storageColumn = [
      { title: '主机项', dataIndex: 'guid' },
      {
        title: '域名',
        dataIndex: 'host',
        render: (val: string, record: any, i: number) => {
          const rules = [
            { pattern: /^[\.A-Za-z0-9\-\,]+(\:\d{2,5})?\/?$/, message: '请输入正确的域名或IP' },
            { required: true, message: '必填' },
          ];
          const width = this.hostWidths[0] || 200;
          return <WebsetTextarea {...getHostFastProps.call(this, 'editingHost', 'host', record, i, rules, width)} />;
        },
      },
      {
        title: '端口',
        dataIndex: 'port',
        render: (val: string, record: any, i: number) => {
          const rules = [{ pattern: /^\d{0,5}$/, message: '请输入正确的端口号' }, { required: true, message: '必填' }];
          const width = this.hostWidths[1] || 125;
          return <WebsetTextarea {...getHostFastProps.call(this, 'editingPort', 'port', record, i, rules, width)} />;
        },
      },
      {
        title: '用户',
        dataIndex: 'user',
        render: (val: string, record: any, i: number) => {
          let rules = [{ pattern: /^[A-Za-z0-9\-@#]{1,10}$/, message: '字母与数字的组合' }, { required: true, message: '必填' }];
          if ('redis,mongodb,rabbitmq'.split(',').includes(record.guid)) {
            rules = [];
          }
          const width = this.hostWidths[2] || 125;
          return <WebsetTextarea {...getHostFastProps.call(this, 'editingUser', 'user', record, i, rules, width)} />;
        },
      },
      {
        title: '密码',
        dataIndex: 'password',
        render: (val: string, record: any, i: number) => {
          let rules = [
            { pattern: /^[A-Za-z0-9\-@\!$#]{4,40}$/, message: '4位以上字母与数字的组合' },
            { required: true, message: '必填' },
          ];
          if ('redis,mongodb,rabbitmq'.split(',').includes(record.guid)) {
            rules = [];
          }
          const width = this.hostWidths[3] || 200;
          return (
            <WebsetTextarea
              {...getHostFastProps.call(this, 'editingPassword', 'password', record, i, rules, width)}
              password={true}
            />
          );
        },
      },
      {
        title: '数据库名',
        dataIndex: 'db',
        render: (val: string, record: any, i: number) => {
          let rules = [{ pattern: /^[A-Za-z0-9]{1,10}$/, message: '请输入字母' }, { required: true, message: '必填' }];
          if ('redis,mongodb,rabbitmq'.split(',').includes(record.guid)) {
            rules = [];
          }
          const width = this.hostWidths[4] || 100;
          return <WebsetTextarea {...getHostFastProps.call(this, 'editingDb', 'db', record, i, rules, width)} />;
        },
      },
    ];
    const editingStorage = (props.editingItem && props.editingItem.storage) || [];
    const storage = storageNames.map(name => editingStorage.find((item: any) => item.guid === name) || { guid: name });
    this.state = {
      storage,
      activeKey: '1',
      threshold: [],
      editingHost: false,
      editingPort: false,
      editingUser: false,
      editingPassword: false,
      templates: [],
    };
    props.dispatch({ type: 'webset/templates', promise: true }).then(v => {
      this.setState({ templates: v.templates.db_template });
    });
  }

  public componentDidMount(): void {
    // 重新加载 editingItem
    const { editingItem = {}, dispatch } = this.props;
    if (editingItem.id) {
      dispatch({
        type: `${this.props.ns}/info`,
        payload: { id: editingItem.id },
      });
    }
    this.props.dispatch({ type: 'webset/threshold', promise: true }).then(v => {
      this.setState({ threshold: v.threshold.site_threshold });
    });
  }

  public componentWillUnmount() {
    const { form } = this.props;
    form.resetFields();
  }

  public updateWidth(): void {
    const host = ReactDOM.findDOMNode(this.hostNode);
    if (host) {
      this.hostWidths = Array.from(host.querySelectorAll('tbody>tr:nth-child(1)>td'))
        .slice(1)
        .map((v: HTMLElement) => {
          v.style.width = v.clientWidth + 'px';
          return v.clientWidth;
        });
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<WebsetEditProps>, nextContext: any): void {
    if (
      nextProps.editingItem &&
      nextProps.editingItem.storage &&
      !isEqual(this.props.editingItem.storage, nextProps.editingItem.storage)
    ) {
      const editingStorage = (nextProps.editingItem && nextProps.editingItem.storage) || [];
      const storage = storageNames.map(
        name => editingStorage.find((item: any) => item.guid === name) || { guid: name }
      );
      this.setState({ storage });
    }
  }

  public render() {
    const { saving, loading, okText } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const editing = this.props.editingItem;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 12 }, className: styles.inputAddon };
    return (
      <Form onSubmit={this.onSubmit} ref={(ref: any) => (this.form = ref)}>
        <Tabs defaultActiveKey={this.state.activeKey}>
          <Tabs.TabPane tab="通用" key="1">
            <Form.Item label="主目录" {...formItemLayout}>
              {getFieldDecorator('sites', {
                initialValue: editing ? editing.sites : '/www/sites',
                rules: [{ required: true, message: '必填' }],
              })(<Input placeholder="主目录" />)}
            </Form.Item>
            <Form.Item label="标识域名" {...formItemLayout}>
              {getFieldDecorator('domain', {
                initialValue: editing && editing.domain,
                rules: [{ required: true, message: '必填' }],
              })(<Input placeholder="全局唯一的标识域名" />)}
            </Form.Item>
            <Form.Item label={<span>*</span>} {...formItemLayout}>
              {getFieldDecorator('is_ssl', {
                initialValue: editing && Boolean(Number(editing.is_ssl)),
                rules: [{ required: false, message: '必填' }],
              })(<Checkbox defaultChecked={Boolean(Number(editing && editing.is_ssl))}>使用SSL</Checkbox>)}
            </Form.Item>
            {/*<Form.Item label="访问令牌" {...formItemLayout}>*/}
            {/*{getFieldDecorator('access_token', {*/}
            {/*initialValue: editing && editing.access_token,*/}
            {/*rules: [{ required: false, message: '必填' }],*/}
            {/*})(*/}
            {/*<Input*/}
            {/*placeholder="访问令牌"*/}
            {/*disabled={!!editing}*/}
            {/*addonAfter={!editing ? <a onClick={() => setFieldsValue({ access_token: uuid32() })}>随机生成</a> : false}*/}
            {/*/>*/}
            {/*)}*/}
            {/*</Form.Item>*/}
            {/*<Form.Item label="jwt公钥" {...formItemLayout}>*/}
            {/*{getFieldDecorator('jwt_token', {*/}
            {/*initialValue: editing && editing.jwt_token,*/}
            {/*rules: [{ required: false, message: '必填' }],*/}
            {/*})(*/}
            {/*<Input*/}
            {/*placeholder="jwt公钥"*/}
            {/*disabled={!!editing}*/}
            {/*addonAfter={!editing ? <a onClick={() => setFieldsValue({ jwt_token: uuid48() })}>随机生成</a> : false}*/}
            {/*/>*/}
            {/*)}*/}
            {/*</Form.Item>*/}
            <Form.Item label="负载级别" {...formItemLayout}>
              {getFieldDecorator('threshold_id', {
                initialValue: editing && editing.threshold_id,
                rules: [{ required: true, message: '必填' }],
              })(
                <Select placeholder={'请选择负载级别'} onChange={this.onChangeLevel}>
                  {this.state.threshold.map(({ name, level, threshold_number, id }: any, index: number) => (
                    <Select.Option key={index} value={id + ''}>
                      {`${name}  ( ${level} 级 ${threshold_number / 10000}万/ 人)`}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <div className={styles.btns}>
              <Button type="primary" htmlType="submit" size="large" disabled={saving || loading}>
                {saving && <Icon type="loading" />}
                {okText}
              </Button>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="主机" key="2">
            <div>
              <Table
                ref={ref => (this.hostNode = ref)}
                className={styles.siteTable}
                bordered={true}
                size="small"
                dataSource={this.state.storage as any}
                columns={this.storageColumn}
                rowKey={buildRowKey}
                pagination={false}
              />
              <div className={styles.btns}>
                <Button type="primary" htmlType="submit" size="large" disabled={saving}>
                  {saving && <Icon type="loading" />}
                  提交
                </Button>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        if ('storage' in err) {
          this.changeErrorTab({ err, activeKey: '2' });
          return;
        } else {
          this.changeErrorTab({ err, activeKey: '1' });
          return;
        }
      }
      // 新增 or 修改
      if (this.props.editingItem && this.props.editingItem.id) {
        fieldsValue.id = this.props.editingItem.id;
      }
      if (!('storage' in fieldsValue)) {
        this.changeErrorTab({ err: { storage: 'not found' }, activeKey: '2' });
        return;
      }
      // 将数组转对象
      const storage = {} as any;
      fieldsValue.storage.forEach((v: any) => {
        storage[v.guid] = v;
        delete v.guid;
      });
      fieldsValue.storage = storage;
      fieldsValue.is_ssl = Number(Boolean(fieldsValue.is_ssl));
      this.props.dispatch({ type: `webset/save`, payload: fieldsValue, promise: true }).then(() => {
        this.props.onSuccess();
      });
    });
  };

  private changeErrorTab = ({ activeKey, err }: any) => {
    const elm = ReactDOM.findDOMNode(this.form).querySelectorAll('.ant-tabs-tab')[activeKey - 1] as HTMLElement;
    if (elm) {
      console.warn('\u2718 表单不正确: ', err);
      elm.click();
    }
  };

  private onChangeLevel = (value: string) => {
    message.warn('已将主机配置更新为此级别的默认配置！');
    const editingStorage = this.state.templates[Number(value)];
    const storage = storageNames.map(name => editingStorage.find((item: any) => item.guid === name) || { guid: name });
    this.setState({ storage });
  };
}

export default Form.create()(WebsetEdit as any)

export interface WebsetEditProps extends ReduxProps, LangSiteState {
  ns: string;
  form?: WrappedFormUtils;
  editingItem?: any;
  saving?: boolean;
  okText: string;
  webset: any;
  loading: boolean; // 重新加载 editingItem
  onSuccess: () => void;
}

interface SiteColumn {
  title: string;
  className?: string;
  dataIndex: string;
  render?: any;
}
