import { Button, Form, Icon, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import { LangSiteState, withLang } from '../../lang.model';
import { connect } from 'kea';

@connect({
  props: [withLang, ['site']],
})
class PasswordEdit extends React.PureComponent<PasswordEditProps, any> {
  constructor(props: PasswordEditProps) {
    super(props);
    this.state = {};
  }
  public render() {
    const { getFieldDecorator } = this.props.form;
    const { site, editingItem = {} } = this.props;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    const tailFormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 24, offset: 8 } };
    const range = '6-16';
    return (
      <Form className="page" onSubmit={this.onSubmit}>
        <Form.Item label={site.新密码} {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: editingItem.password,
            rules: [
              { pattern: /^[A-Za-z0-9]{6,16}$/, required: true, message: `${site.请输入}${range}${site.位数字和字母组合}` },
              { message: site.不能纯数字, pattern: /^(\d*[A-Za-z]\d*)+$/ },
            ],
          })(<Input placeholder={site.请输入新密码} />)}
        </Form.Item>
        <Form.Item label={site.确认新密码} {...formItemLayout}>
          {getFieldDecorator('password2', {
            initialValue: editingItem.password2,
            rules: [{ required: true, message: site.请再输入一次密码 }, { validator: this.checkPassword }],
          })(<Input placeholder={site.请再输入一次密码} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">
            {this.props.saving && <Icon type="loading" />}
            {site.提交}
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
      if (this.props.editingItem && this.props.editingItem.id) {
        fieldsValue.id = this.props.editingItem.id;
      }
      this.props.dispatch({ type: 'subaccount/password', payload: fieldsValue, promise: true }).then(() => {
        this.props.form.resetFields();
        this.props.onSuccess();
      });
    });
  };

  private checkPassword = (rule: any, value: string, callback: (err?: string) => void) => {
    const { form, site } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      // callback('Two passwords that you enter is inconsistent!');
      callback(site.两次密码输入不一致);
    } else {
      callback();
    }
  };
}

export default Form.create()(PasswordEdit as any)

interface PasswordEditProps extends ReduxProps, LangSiteState {
  form?: WrappedFormUtils;
  editingItem: any;
  saving: boolean;
  onSuccess: () => void;
}
