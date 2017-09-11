import { Button, Checkbox, DatePicker, Form, Icon, Input, Modal, Popconfirm, Select, Switch, Table, Spin } from 'antd';
import { ValidationRule, WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps } from 'antd/lib/table/Column';
import { isEqual, uniqBy, memoize, partial } from 'lodash';
import * as React from 'react';
import buildRowKey from '../../utils/buildRowKey';
import environment from '../../utils/environment';
import RangePicker from '../components/RangePicker';
import { LangSiteState } from '../lang.model';
import { AllStore, AnyStore, BaseModelState } from './BaseModel';
import './BasePage.scss';
import getDataSourceMap from './getDataSourceMap';
import { FormComponentProps } from 'antd/es/form/Form';

class DefaultComponent extends React.PureComponent<any, any> {
  public render(): null {
    return null;
  }
}

class A extends React.PureComponent<any, any> {
  render () {
    console.log('☞☞☞ 9527 BasePage 23', this.props.id);
    return <a onClick={this.props.onClick}>编辑</a>;
  }
}

export default class BasePage<T extends BasePageProps, S> extends React.PureComponent<T, any> {
  protected actions: Actions;
  protected fieldsForUpdate: Column[];
  protected fieldsForCreate: Column[];
  protected columns: Column[];
  protected searchs: SearchColumn[];
  protected tableActions: TableAction[];
  protected withStatus: boolean;
  protected withEdit: boolean;
  protected withDelete: boolean;
  protected createComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  protected createOkText: string;
  protected updateComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  protected updateOkText: string;
  protected beforeComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  protected afterComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  protected footer: React.ComponentClass<any> | React.StatelessComponent<any>;
  protected ns: keyof AllStore;
  protected itemName: string;
  protected canCreate: boolean;
  protected createBtnName: string;
  protected withOperator: boolean;
  protected rowSelection: boolean;
  protected hasFooter: boolean;
  protected switchId: string;
  protected modalWidth: number;
  protected onRowClick: (record: any, index?: number, event?: any) => void;

  constructor(props: T, context: BasePageConfig) {
    super(props);
    const { site } = props;
    let fieldsForTable = [];
    if (context == null) {
      throw new Error('第二个参数包含 ns 和 itemName 等的对象！');
    } else if (context.ns == null) {
      throw new Error('命名空间 ns 不得为空！');
    } else {
      this.ns = context.ns;
      this.itemName = props.itemName;
      this.createComponent = context.createComponent || DefaultComponent;
      this.createOkText = context.createOkText || site.提交;
      this.updateComponent = context.updateComponent || DefaultComponent;
      this.updateOkText = context.updateOkText || site.提交;
      this.beforeComponent = context.beforeComponent || DefaultComponent;
      this.afterComponent = context.afterComponent || DefaultComponent;
      this.footer = context.footer;
      this.hasFooter = Boolean(context.footer) || context.rowSelection;
      this.columns = context.columns || [];
      this.searchs = context.searchs || [];
      this.tableActions = context.actions || [];
      this.withDelete = context.withDelete !== false;
      this.withEdit = context.withEdit !== false;
      this.withStatus = context.withStatus !== false;
      this.canCreate = context.canCreate !== false;
      this.createBtnName = context.createBtnName;
      this.withOperator = context.withOperator !== false;
      this.rowSelection = context.rowSelection;
      this.onRowClick = context.onRowClick;
      this.modalWidth = context.modalWidth;
      if (this.withStatus) {
        const index = this.columns.findIndex(v => v.dataIndex === 'status');
        const [status] = index >= 0 ? this.columns.splice(index, 1) : [null];
        const defaultStatus = {
          title: '状态',
          dataIndex: 'status',
          render: (val: string, record: any) => {
            const [txt1, txt2] = (status && status.labels) || ['启用', '停用'];
            const checked = val === undefined ? true : Boolean(parseInt(val, 10));
            return (
              <span>
                <Switch
                  key={this.state.switchKey}
                  checkedChildren={txt1}
                  unCheckedChildren={txt2}
                  onChange={isChecked => this.changeStatus(record.id, isChecked, [txt1, txt2])}
                  defaultChecked={checked}
                />
              </span>
            );
          },
        };
        const statusOk = index >= 0 && status ? { ...defaultStatus, ...status } : defaultStatus;
        this.columns.push(statusOk);
      }
      if (this.withOperator && (this.withDelete || this.withEdit || (this.tableActions && this.tableActions.length))) {
        this.columns.push({
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span className="actions">
              {this.withEdit && <A id={record.id} onClick={this.onShowEdit(record)}>{site.编辑}</A>}
              {this.tableActions.map(
                action =>
                  action.render ? (
                    action.render(record)
                  ) : (
                    <a
                      key={action.label}
                      hidden={action.hidden && action.hidden(record)}
                      className={action.disabled && action.disabled(record) && 'disabled'}
                      onClick={action.onClick.bind(this, record)}
                    >
                      {action.label}
                    </a>
                  )
              )}
              {this.withDelete && (
                <Popconfirm title="确定要删除吗？" onConfirm={this.onDelete.bind(this, record)}>
                  <a>{site.删除}</a>
                </Popconfirm>
              )}
            </span>
          ),
        });
      }
      fieldsForTable = this.columns.filter(v => v.canShow !== false);
      this.fieldsForCreate = this.columns.filter(v => v.canForm || v.canFormCreate);
      this.fieldsForUpdate = this.columns.filter(v => v.canForm || v.canFormUpdate);
    }
    this.state = {
      fieldsForTable,
      isShowAdd: false,
      isShowEdit: false,
      dataSourceMap: getDataSourceMap.call(this, context.searchs),
      selectedRowKeys: [],
    };
    this.onShowEdit = this.onShowEdit.bind(this);
  }

  public componentWillReceiveProps(nextProps: T) {
    // 点击【提交】后，隐藏modal
    // if (nextProps.saving) {
    // 已改为 SimpleEdit 隐藏了
    // this.setState({
    //   isShowAdd: false,
    //   isShowEdit: false,
    // });
    // }
    // 弹出编辑modal时，先请求infoAjax, 更新 props.info 到最新数据 editingItem
    if (this.state.isShowEdit) {
      const info = nextProps.info;
      if (info && info.id === this.state.editingItem.id) {
        this.setState({
          editingItem: nextProps.info,
        });
      }
    }
    // 用于强制刷新 Switch 状态, 特别是失败时
    if (!isEqual(nextProps.list, this.props.list)) {
      this.setState({
        switchKey: Date.now(),
      });
    }
  }

  public componentWillUnmount() {
    const { form } = this.props;
    form.resetFields();
  }

  public componentDidMount() {
    const query = this.props.location && this.props.location.query;
    if (query) {
      this.props
        .dispatch({
          type: `${this.ns}/query`,
          payload: query,
          promise: true,
        })
        .then(v => {
          if (query) {
            try {
              this.props.form.setFieldsValue(query);
            } catch (e) {}
          }
        });
    } else {
      this.props.actions.query({});
      // this.props.dispatch({
      //   type: `${this.ns}/query`,
      //   payload: query,
      // });
    }
    setInterval(() => {
      this.setState({ok: Date.now()})
    }, 1000)
  }

  // Todo 会影响到 antd 的 Select ，怀疑 Select 使用了 document 之类的方法
  // public shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<any>, nextContext: any): boolean {
  //   return !isEqual(nextState, this.state) || !isEqual(nextProps, this.props);
  // }

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { selectedRowKeys } = this.state;
    const { site, list, loading, saving, page, total } = this.props;
    const pageSize = environment.page_size;
    const layout16 = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layout20 = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    let CreateComponent = this.createComponent; // tslint:disable-line
    let UpdateComponent = this.updateComponent; // tslint:disable-line
    let BeforeComponent = this.beforeComponent; // tslint:disable-line
    let AfterComponent = this.afterComponent; // tslint:disable-line
    const rowSelct = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const editId = this.state.editingItem ? this.state.editingItem.id : '0';
    const filters = uniqBy(this.columns.filter(column => column.filter), v => v.filter[0]);
    return (
      <div className="page">
        <div className="base-before">
          <BeforeComponent />
        </div>

        <div className="base-main">
          <Form className={'page e2e-toolBar'} onSubmit={this.onSearch} layout="inline">
            {this.searchs.map(v => (
              <Form.Item
                key={v.dataIndex}
                label={v.title}
                {...(v.formType === FormType.DateRange ? layout20 : layout16)}
                className={'formItem' + (v.formType === FormType.DateRange ? ' ' + 'dateRange' : ' ')}
              >
                {getFieldDecorator(v.dataIndex, { initialValue: v.initialValue })(
                  (() => {
                    if (v.formType === undefined) {
                      return (
                        <Input
                          placeholder={site.请输入关键字}
                          onBlur={this.onSearchChange.bind(this, v.dataIndex)}
                          suffix={
                            getFieldValue(v.dataIndex) ? (
                              <Icon type="close-circle" onClick={this.onSearchEmpty.bind(this, v.dataIndex)} />
                            ) : null
                          }
                        />
                      );
                    } else if (v.formType === FormType.Select) {
                      return (
                        <Select placeholder={site.请选择} dropdownClassName="select">
                          {this.state.dataSourceMap.get(v.dataIndex).map((item: DataSource) => (
                            <Select.Option
                              key={item.id >= 0 ? String(item.id) : item.value}
                              value={item.id >= 0 ? String(item.id) : item.value}
                            >
                              {item.title || item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      );
                    } else if (v.formType === FormType.DatePicker) {
                      return <DatePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />;
                    } else if (v.formType === FormType.DateRange) {
                      const [start, end] = v.dataIndex.split(',');
                      return <RangePicker label={''} form={this.props.form} startField={start} endField={end} />;
                    } else {
                      return <div />;
                    }
                  })() // tslint:disable-line
                )}
              </Form.Item>
            ))}
            {this.searchs.length > 0 && (
              <div style={{ display: 'inline-block' }} className="e2e-searchBtn">
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large">
                    {site.查询}
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.onReset} size="large">
                    重置
                  </Button>
                </Form.Item>
              </div>
            )}
            {this.canCreate && (
              <Form.Item>
                <Button onClick={this.onShowAdd} type="primary" size="large" className="e2e-create-btn">
                  {this.createBtnName || `${site.新增}${this.itemName}`}
                </Button>
              </Form.Item>
            )}
            {filters.length > 0 && (
              <Form.Item className="filter">
                <span className="filterName">筛选可见列</span>
                {filters.map(column => (
                  <Checkbox
                    key={column.filter[0]}
                    indeterminate={this.state.indeterminate}
                    onChange={event => this.onCheckFilter(column, (event.target as HTMLInputElement).checked)}
                    checked={column.canShow || column.canShow === undefined}
                  >
                    {column.filter[1]}
                  </Checkbox>
                ))}
              </Form.Item>
            )}
          </Form>
          {list && !loading ? this.state.fieldsForTable.length > 0 ? (
            <Table
              className="table"
              bordered={true}
              dataSource={list}
              columns={this.state.fieldsForTable}
              rowKey={buildRowKey}
              rowSelection={this.rowSelection ? rowSelct : null}
              footer={this.footer as any}
              onRowClick={this.onRowClick}
              pagination={
                page > 0 ? (
                  {
                    total,
                    pageSize,
                    current: page,
                    showSizeChanger: true,
                    onChange: this.onChangePage,
                    onShowSizeChange: this.onChangePage,
                  }
                ) : (
                  false
                )
              }
            /> // tslint:disable-line
          ) : null : (
            <Spin tip="Loading..." />
          )}
        </div>

        <div className="base-after">
          <AfterComponent />
        </div>

        <Modal
          key="create"
          title={this.createBtnName || `${site.新增}${this.itemName}`}
          visible={this.state.isShowAdd}
          onCancel={this.onCancelAdd}
          onOk={this.onOkAdd}
          width={this.modalWidth}
          footer={null}
        >
          <CreateComponent
            saving={saving}
            fields={this.fieldsForCreate}
            ns={this.ns}
            effect="save"
            okText={this.createOkText}
            onSuccess={this.onOkAdd}
          />
        </Modal>

        <Modal
          key={editId}
          title={`${site.编辑}${this.itemName}`}
          visible={this.state.isShowEdit}
          onCancel={this.onCancelEdit}
          width={this.modalWidth}
          onOk={this.onOkEdit}
          footer={null}
        >
          <UpdateComponent
            loading={loading}
            editingItem={this.state.editingItem}
            saving={saving}
            fields={this.fieldsForUpdate}
            ns={this.ns}
            effect="save"
            okText={this.updateOkText}
            onSuccess={this.onOkEdit}
          />
        </Modal>
      </div>
    );
  }

  // 启用停用
  protected changeStatus = (id: string, checked: boolean, labels = ['启用', '停用']) => {
    this.switchId = id;
    this.props.dispatch({
      type: `${this.ns}/status`,
      payload: { id, labels, status: checked ? 1 : 0 },
    });
  };

  // 批量禁止
  protected rowSlecdeny = () => {
    this.props.dispatch({
      type: `${this.ns}/select`,
      payload: { ids: this.state.selectedRowKeys.join(',').split(','), op: '1' },
    });
    this.setState({ selectedRowKeys: [] });
  };

  // 批量允许
  protected rowSlecallow = () => {
    this.props.dispatch({
      type: `${this.ns}/select`,
      payload: { ids: this.state.selectedRowKeys.join(',').split(','), op: '0' },
    });
    this.setState({ selectedRowKeys: [] });
  };

  // 批量删除
  protected rowSlecDele = () => {
    this.props.dispatch({ type: `${this.ns}/deleteBatch`, payload: { ids: this.state.selectedRowKeys.join(',') } });
    this.setState({ selectedRowKeys: [] });
  };

  // 筛选可见列
  protected onCheckFilter = (column: Column, checked: boolean) => {
    this.setState(state => {
      this.columns = this.columns.map(
        v => (v.filter && column.filter[0] === v.filter[0] ? { ...v, canShow: checked } : v)
      );
      return { fieldsForTable: this.columns.filter(v => v.canShow || v.canShow === undefined) };
    });
  };

  protected doQuery({ page, page_size }: any) {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.searchs.map(v => {
        const val = fieldsValue[v.dataIndex];
        if (v.formType === FormType.DatePicker && fieldsValue[v.dataIndex]) {
          fieldsValue[v.dataIndex] = Math.ceil(val.valueOf() / 1000);
        } else if (v.formType === FormType.DateRange) {
          const [start, end] = v.dataIndex.split(',');
          if (fieldsValue[start]) {
            fieldsValue[start] = Math.ceil(fieldsValue[start].valueOf() / 1000);
          } else {
            delete fieldsValue[start];
          }
          if (fieldsValue[end]) {
            fieldsValue[end] = Math.ceil(fieldsValue[end].valueOf() / 1000);
          } else {
            delete fieldsValue[end];
          }
          delete fieldsValue[v.dataIndex];
        } else if (v.formType === FormType.Select && fieldsValue[v.dataIndex] === '全部') {
          delete fieldsValue[v.dataIndex];
        }
        // 移除空字符串的字段
        if (fieldsValue[v.dataIndex] === '' || fieldsValue[v.dataIndex] == null) {
          delete fieldsValue[v.dataIndex];
        }
      });
      fieldsValue.page = page;
      fieldsValue.page_size = page_size;
      this.props.dispatch({ type: `${this.ns}/query`, payload: fieldsValue });
    });
  }

  protected onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    this.doQuery({ page: 1, page_size: environment.page_size });
  };

  protected onShowAdd = () => {
    this.setState({
      isShowAdd: true,
    });
  };

  // 重置
  protected onReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
  };

  protected onOkAdd = () => {
    this.setState({
      isShowAdd: false,
    });
  };

  protected onCancelAdd = () => {
    this.setState({
      isShowAdd: false,
    });
  };

  // 解决问题：实现 jsx 属性中 onClick={()=>this.onShowEdit(editingItem)} 总是产生新函数
  // 思路类似 html： onclick="行内脚本"
  // 使用方法 jsx：onClick={this.onShowEdit(editingItem)}
  @(function (t:any,pk:any,d:any){
    const originFn = d.value;
    const getFn = function (this: any, val: any) {
      return originFn.bind(this, val);
    };
    d.value=memoize(getFn);
    return d;
  })
  protected onShowEdit(editingItem: any): any {
    this.setState({
      editingItem,
      isShowEdit: true,
    });
  };

  protected onOkEdit = () => {
    this.setState({
      isShowEdit: false,
    });
  };

  protected onCancelEdit = () => {
    this.setState({
      isShowEdit: false,
    });
  };

  private onDelete = ({ id }: any) => {
    this.props.dispatch({ type: `${this.ns}/remove`, payload: { id } });
  };

  private onSearchEmpty = (field: string) => {
    this.props.form.resetFields([field]);
    this.doQuery({ page: 1, page_size: environment.page_size });
  };

  private onSearchChange = (field: string) => {
    const value = this.props.form.getFieldValue(field);
    if (value === '') {
      this.doQuery({ page: 1, page_size: environment.page_size });
    }
  };

  // tslint:disable-next-line
  private onChangePage = (page: number, page_size: number) => {
    environment.page_size = page_size;
    this.doQuery({ page, page_size: environment.page_size });
  };

  private onSelectChange = (selectedRowKeys: string[]) => {
    this.setState({ selectedRowKeys });
  };
}
export class Actions {
  query = (p: any) => ({} as Promise<any>);
  info = (p: any) => ({} as Promise<any>);
  remove = (p: any) => ({} as Promise<any>);
  save = (p: any) => ({} as Promise<any>);
  status = (p: any) => ({} as Promise<any>);
  querySuccess = (p: any) => ({} as any);
  infoSuccess = (p: any) => ({} as Promise<any>);
  removeSuccess = (p: any) => ({} as Promise<any>);
  saveSuccess = (p: any) => ({} as Promise<any>);
  statusSuccess = (p: any) => ({} as Promise<any>);

  [k: string]: (p: any) => Promise<any>;
}
export interface BasePageProps extends FormComponentProps, BaseModelState, ReduxProps, LangSiteState, AnyStore {
  // form?: WrappedFormUtils;
  location?: { query: any; state: any };
  actions?: Actions;
}

export enum FormType {
  Hidden, // 隐含字段
  InputText, // 文本输入框，默认值
  InputNumber, // 数字输入框，
  Account, // 文本输入框，6位数字和字母组合，仅平台账号有同名检测
  Password, // 密码输入框，需要输入二次确认
  Password2, // 密码输入框，需要输入二次确认
  url, // url地址
  host, // 域名
  TextArea,
  Select,
  UploadImage,
  Checkbox,
  Radio,
  RadioButton,
  DatePicker,
  DateRange,
  Switch,
  Static, // 静态文字
  IpList, // 批量文字
}

export interface Column extends ColumnProps<any> {
  // 以下为Table中使用
  canShow?: boolean; // 是否在表格中显示， 默认为 true
  canCreate?: boolean; // 是否显示新增按钮
  canColumnEdit?: boolean; // 是否整列编辑，默认为 false
  canCellEdit?: boolean; // 是否可编辑单元格
  filter?: [string, string]; // 筛选：第一个表示 Checkbox 勾选后显示对应列 dataIndex, 显示文字

  // 以下为Form表单使用
  canForm?: boolean; // 是否出现在【创建】和【编辑】表单中， 默认为 false
  canFormCreate?: boolean; // 是否出现在【创建】表单中， 默认为 false
  canFormUpdate?: boolean; // 是否出现在【编辑】表单中， 默认为 false
  formType?: FormType; // 默认为【InputText】
  dataSource?: DataSource[] | Promise<{ list: DataSource[] }>; // 默认为【InputText】
  disabled?: boolean; // 是否禁止修改，默认 false
  required?: boolean; // 是否必填，默认为 true
  minLength?: number; // 最小长度
  maxLength?: number; // 最大长度
  rules?: ValidationRule[]; // 最大长度
  content?: React.ReactChild; // checkbox中内容
  labels?: string[]; // Switch 开关文字
  values?: string[]; // Switch 开关的变量enable,disable两种
  otherData?: any; // 下拉选择时传更多的参数
  formClassName?: string;
}
// 比 Column 字段少
export interface SearchColumn {
  title?: React.ReactNode;
  dataIndex?: string;
  formType?: FormType;
  initialValue?: any;
  dataSource?: DataSource[] | Promise<{ list: DataSource[] }>; // 默认为【InputText】
}
interface TableAction {
  label: string;
  disabled?: (record: any) => boolean;
  hidden?: (record: any) => boolean;
  onClick?: (record: any) => void;
  render?: (record: any) => any;
}

// Checkbox 的数据源
export interface DataSource {
  id?: number; // 如果是从后端返回的数据一般为id
  value?: string; // 硬编码的一般为字符串常量
  title: string;
  name?: string;
  // dataIndex: string; // 哪来的，不需要吧
}

export interface BasePageConfig {
  ns: keyof AllStore;
  updateComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  createComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
  beforeComponent?: React.ComponentClass<any> | React.StatelessComponent<any>;
  afterComponent?: React.ComponentClass<any> | React.StatelessComponent<any>;
  footer?: React.ComponentClass<any> | React.StatelessComponent<any>; // 表格底部
  createOkText?: string; // 弹出框确定按钮的文字
  updateOkText?: string; // 弹出框编辑按钮的文字
  modalWidth?: number; // 弹出框的宽
  columns: Column[];
  searchs?: SearchColumn[];
  actions?: TableAction[]; // 单元格其它操作按钮
  withDelete?: boolean; // 单元格删除
  withEdit?: boolean; // 单元格编辑
  withStatus?: boolean; // 单元格状态
  canCreate?: boolean; // 新增按钮
  createBtnName?: string; // 新增按钮文字
  withOperator?: boolean; // 单元格操作
  rowSelection?: boolean; // 表格选择
  onRowClick?: (record: any, index?: number, event?: any) => void; // 点击一行
}
