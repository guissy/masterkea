import { Button, Checkbox, DatePicker, Form, Icon, Input, InputNumber, Radio, Select, Switch, Upload } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import { ValidationRule } from 'antd/lib/form/Form';
// import { connect } from 'dva';
import * as moment from 'moment';
import * as React from 'react';
import { getImageOption } from '../../utils/upload';
import { LangSiteState, withLang } from '../lang.model';
import IpList from '../components/iplist/IpList';
import { Column, DataSource, FormType } from './BasePage';
import getDataSourceMap from './getDataSourceMap';
import { kea } from 'kea';


@kea({
  connect: {
    props: [withLang, ['site']],
  },
})
class SimpleEdit extends React.PureComponent<SimpleEditProps, any> {
  protected ns: string;

  constructor(props: SimpleEditProps) {
    super(props);
    if (props.ns == null) {
      throw new Error('命名空间 ns 不得为空！');
    } else {
      this.ns = props.ns;
    }
    this.state = {
      dataSourceMap: getDataSourceMap.call(this, props.fields),
    };
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
  }
  public render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { site, editingItem = {}, saving, loading, okText } = this.props;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    const tailFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24, offset: 8 },
    };
    const fields = this.props.fields.filter(v => v.formType !== FormType.Hidden);
    return (
      <Form onSubmit={this.onSubmit}>
        {this.props.children}
        {fields.map(
          v =>
            v.formType !== FormType.checktype
              ? <Form.Item key={v.dataIndex} label={v.title} {...formItemLayout} className={v.formClassName || ''}>
                {getFieldDecorator(v.dataIndex, this.getFieldOpt(editingItem, v))(
                  (() => {
                    if (v.formType === undefined) {
                      return <Input type="text" placeholder={`${site.请输入}${v.title}`} />;
                    } else if (v.formType === FormType.InputNumber) {
                      return <InputNumber min={1} placeholder={`${site.请输入}${v.title}`} />;
                    } else if (v.formType === FormType.TextArea) {
                      return <Input type="textarea" placeholder={`${site.请输入}${v.title}`} />;
                    } else if (v.formType === FormType.Account) {
                      return <Input type="text" placeholder={`${site.请输入}${v.title}`} />;
                    } else if (v.formType === FormType.Password) {
                      return <Input type="password" placeholder={`${site.请输入}${v.title}`} />;
                    } else if (v.formType === FormType.Password2) {
                      return <Input type="password" placeholder={site.请再输入一次密码} />;
                    } else if (v.formType === FormType.url) {
                      return <Input type="text" placeholder="请输入地址" />;
                    } else if (v.formType === FormType.host) {
                      return <Input type="text" placeholder="请输入域名" />;
                    } else if (v.formType === FormType.Checkbox) {
                      return (
                        <Checkbox>
                          {v.content}
                        </Checkbox>
                      );
                    } else if (v.formType === FormType.DatePicker) {
                      return <DatePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" placeholder="选择时间" />;
                    } else if (v.formType === FormType.Switch) {
                      const [txt1, txt2] = v.labels || ['启用', '停用'];
                      const checked =
                        editingItem[v.dataIndex] === undefined ? true : Boolean(editingItem[v.dataIndex]);
                      return <Switch checkedChildren={txt1} unCheckedChildren={txt2} defaultChecked={checked} />;
                    } else if (v.formType === FormType.UploadImage) {
                      return (
                        <Upload {...getImageOption(editingItem[v.dataIndex])}>
                          <Button type="ghost">
                            <Icon type="upload" />上传
                          </Button>
                        </Upload>
                      );
                    } else if (v.formType === FormType.Radio) {
                      return (
                        <Radio.Group>
                          {this.state.dataSourceMap.get(v.dataIndex).map((item: DataSource) =>
                            <Radio key={item.id} value={item.id}>
                              {item.title || item.name}
                            </Radio>
                          )}
                        </Radio.Group>
                      );
                    } else if (v.formType === FormType.RadioButton) {
                      return (
                        <Radio.Group>
                          {this.state.dataSourceMap.get(v.dataIndex).map((item: DataSource) =>
                            <Radio.Button key={item.id} value={item.id}>
                              {item.title || item.name}
                            </Radio.Button>
                          )}
                        </Radio.Group>
                      );
                    } else if (v.formType === FormType.Select) {
                      return (
                        <Select
                          placeholder={site.请选择}
                          onChange={(val: any) => {
                            const selected = this.state.dataSourceMap
                              .get(v.dataIndex)
                              .find((item: DataSource) => item.value === val || item.id == val);
                            v.otherData
                              ? this.setState({
                                [v.otherData]: selected.title || selected.name,
                              })
                              : '';
                          }}
                        >
                          {this.state.dataSourceMap
                            .get(v.dataIndex)
                            .filter((item: DataSource) => item.value !== '全部')
                            .map((item: DataSource) =>
                              <Select.Option
                                key={item.id >= 0 ? String(item.id) : item.value}
                                value={item.id >= 0 ? String(item.id) : item.value}
                              >
                                {item.title || item.name}
                              </Select.Option>
                            )}
                        </Select>
                      );
                    } else if (v.formType === FormType.IpList) {
                      return (
                        <IpList
                          name={v.dataIndex}
                          lineHeight={32}
                          width={244}
                          form={this.props.form}
                          dirty={true}
                          rules={[
                            {
                              pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
                              message: '正确填写IP地址',
                            },
                          ]}
                        />
                      );
                    } else {
                      // 只显示文字
                      return <StaticText />;
                    }
                  })()
                )}
              </Form.Item>
              : <Form.Item key={v.dataIndex} label={v.title} {...formItemLayout} className={v.formClassName || ''}>
                <div>
                  {v.dataIndex.split(',').map((w: any, i: any) =>
                    getFieldDecorator(w)(
                      <Checkbox key={i} defaultChecked={false}>
                        {v.otherData[i]}
                      </Checkbox>
                    )
                  )}
                </div>
              </Form.Item>
        )}
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" disabled={saving || loading}>
            {saving && <Icon type="loading" />}
            {okText}
          </Button>
        </Form.Item>
      </Form>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.fields.filter(v => v.formType === FormType.Hidden).forEach(v => {
        fieldsValue[v.dataIndex] = this.props.editingItem[v.dataIndex];
      });
      if (this.props.editingItem && this.props.editingItem.id) {
        fieldsValue.id = this.props.editingItem.id;
      }
      // 处理时间值和上传文件的值
      this.props.fields.map((v: any) => {
        const val = fieldsValue[v.dataIndex];
        const raw = this.props.editingItem && this.props.editingItem[v.dataIndex];
        if (v.formType === FormType.Checkbox || v.formType === FormType.Switch) {
          if (typeof val === 'boolean') {
            if (v.values) {
              return v.values[0];
            } else {
              fieldsValue[v.dataIndex] = Number(val);
            }
          }
        } else if (v.formType === FormType.DatePicker && fieldsValue[v.dataIndex]) {
          fieldsValue[v.dataIndex] = Math.ceil(val.valueOf() / 1000);
        } else if (v.formType === FormType.UploadImage) {
          if (val && val.fileList && val.fileList[0]) {
            const res = val.fileList[0].response;
            if (res && res.data) {
              fieldsValue[v.dataIndex] = res.data.file[0].url; // 新上传的
            } else {
              console.error('文件上传出错啦！！！', res);
              fieldsValue[v.dataIndex] = raw;
            }
          } else {
            fieldsValue[v.dataIndex] = raw; // 恢复原来的值
          }
        }
      });
      delete fieldsValue.password2;
      this.props.dispatch({ type: `${this.ns}/${this.props.effect}`, payload: fieldsValue });
      this.props.dispatch({ type: `${this.ns}/${this.props.effect}Success@Promise`, payload: fieldsValue }).then(() => {
        this.props.form.resetFields();
        if (this.props.onSuccess) {
          this.props.onSuccess.call(null);
        }
      });
      // this.props.dispatch({ type: `${this.ns}/reset@Promise` }).then(() => {
      //   this.props.form.resetFields();
      // });
    });
  };

  private getFieldOpt(editingItem: any, { formType, dataIndex, rules, required, title, minLength, maxLength }: Column) {
    // 验证规则
    const { site } = this.props;
    const initialValue = editingItem[dataIndex];
    let opt: { initialValue?: any; rules: ValidationRule[] };
    if (Array.isArray(rules)) {
      opt = { rules, initialValue };
    } else if (formType === FormType.Account) {
      minLength = minLength || 6;
      maxLength = maxLength || 16;
      const pattern = new RegExp('^[A-Za-z0-9]{' + minLength + ',' + maxLength + '}$');
      const range = minLength + '-' + maxLength;
      opt = {
        initialValue,
        rules: [
          {
            pattern,
            required: required !== false,
            message: `${site.请输入}${range}${site.位数字和字母组合}`,
          },
          { validator: this.exists },
          { message: site.不能纯数字, pattern: /^(\d*[A-Za-z]\d*)+$/ },
        ],
      };
    } else if (formType === FormType.url) {
      const pattern = /^https?:\/\/[\.\w\-]+(\:\d{2,5})?\/?/;
      opt = {
        initialValue,
        rules: [
          {
            pattern,
            required: required !== false,
            message: `请输入正确的地址`,
          },
        ],
      };
    } else if (formType === FormType.host) {
      const pattern = /^[\.\w\-]+(\:\d{2,5})?\/?$/;
      opt = {
        initialValue,
        rules: [
          {
            pattern,
            required: required !== false,
            message: `请输入正确的域名`,
          },
        ],
      };
    } else if (formType === FormType.Password) {
      minLength = minLength || 6;
      maxLength = maxLength || 16;
      let range = minLength + '-' + maxLength;
      if (minLength === maxLength) {
        range = String(minLength);
      }
      const pattern = new RegExp('^[A-Za-z0-9]{' + minLength + ',' + maxLength + '}$');
      opt = {
        initialValue,
        rules: [
          {
            pattern,
            required: required !== false,
            message: `${site.请输入}${range}${site.位数字和字母组合}`,
          },
          { message: site.不能纯数字, pattern: /^(\d*[A-Za-z]\d*)+$/ },
        ],
      };
    } else if (formType === FormType.Password2) {
      opt = {
        initialValue,
        rules: [{ required: required !== false, message: site.请再输入一次密码 }, { validator: this.checkPassword }],
      };
    } else if (formType === FormType.Select) {
      opt = {
        initialValue: initialValue && String(initialValue),
        rules: [{ required: required !== false, message: `${site.请选择}${title}` }],
      };
    } else if (formType === FormType.DatePicker) {
      opt = {
        initialValue: initialValue && moment(initialValue),
        rules: [{ required: required !== false, message: `${site.请选择}${title}` }],
      };
    } else if (formType === FormType.Switch) {
      opt = {
        initialValue: initialValue === undefined ? true : initialValue,
        rules: [{ required: required !== false }],
      };
    } else {
      const minRule = { min: minLength, message: `不得少于${minLength}字` };
      const maxRule = { max: maxLength, message: `不得超过${minLength}字` };
      const rulesTmp = [{ required: required !== false, message: `${site.请输入}${title}` }];
      if (minLength) {
        rulesTmp.push(minRule as any);
      }
      if (maxLength) {
        rulesTmp.push(maxRule as any);
      }
      opt = {
        initialValue,
        rules: rulesTmp,
      };
    }
    return opt;
  }

  private checkPassword = (rule: any, value: string, callback: (err?: string) => void) => {
    const { form, site } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      // callback('Two passwords that you enter is inconsistent!');
      callback(site.两次密码输入不一致);
    } else {
      callback();
    }
  };

  private exists = (rule: any, value: string, callback: (err?: string) => void) => {
    if (value) {
      this.props.dispatch({ type: 'subaccount/exists', payload: { account: value } });
      this.props.dispatch({ type: 'subaccount/existsSuccess@Promise' }).then(v => {
        if (v.exists && v.exists.status === 1) {
          callback('账户已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };
}

export default Form.create()(SimpleEdit);

// tslint:disable-next-line
const StaticText = (({ value }: any) =>
  <p>
    {value}
  </p>) as React.SFC<{ value?: string }>;

export interface SimpleEditProps extends ReduxProps, LangSiteState, FormComponentProps {
  ns: string;
  effect: string; // 提交时 dispatch 的 type 名，
  // form?: WrappedFormUtils;
  editingItem?: any;
  saving?: boolean;
  fields: Column[];
  okText: string;
  loading: boolean; // 编辑时需要拉最新、最全的内容
  onSuccess?: () => void; // 提交成功后回调，如用于隐藏 modal
}
