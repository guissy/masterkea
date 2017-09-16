import { Button, Form, Icon, Input, Select } from 'antd';
import * as React from 'react';
import * as styles from './Hall.less';
import { BasePageProps } from '../../abstract/BasePage';
import { kea } from 'kea';
import { withHall } from './Hall.model';

@kea({
  connect: {
    props: [withHall, ['hallLoginLoading', 'hallLogin', 'saving']],
  },
})
class LoginEdit extends React.PureComponent<LoginEditProps, any> {
  actions: any;

  constructor(props: LoginEditProps) {
    super(props);
    this.state = {
      shouldShowPwd: false,
    };
  }

  public render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { shouldShowPwd } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { hallLoginLoading, hallLogin, saving } = this.props as any;
    return (
      <div>
        {!hallLoginLoading && hallLogin ? (
          <Form layout="horizontal" onSubmit={this.onSubmit}>
            <Form.Item label="厅主名称" {...formItemLayout}>
              {getFieldDecorator('company_name', {
                initialValue: hallLogin.company_name,
                rules: [{ required: true, message: '不能为空' }],
              })(<Input disabled={true} />)}
            </Form.Item>
            <Form.Item label="厅主账号" {...formItemLayout}>
              {getFieldDecorator('company_account', {
                initialValue: hallLogin.company_account,
              })(<Input disabled={true} />)}
            </Form.Item>
            <Form.Item label="登录账号" {...formItemLayout}>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '不能为空' }, { validator: this.accountExist }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="登录密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '不能为空' }],
              })(
                <Input
                  type={shouldShowPwd ? 'text' : 'password'}
                  style={{ cursor: 'pointer' }}
                  suffix={<Icon type={shouldShowPwd ? 'eye-o' : 'eye'} onClick={this.togglePwdVisiblity} />}
                />
              )}
            </Form.Item>
            <Form.Item label="确认密码" {...formItemLayout}>
              {getFieldDecorator('confirm_password', {
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: '1',
                rules: [{ required: true, message: '不能为空' }],
              })(
                <Select>
                  <Select.Option value="1">启用</Select.Option>
                  <Select.Option value="0">停用</Select.Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item className={styles.submit}>
              <Button type="primary" htmlType="submit" size="large" disabled={saving}>
                {saving && <Icon type="loading" />}
                提交
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>loading</div>
        )}
      </div>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          id: this.props.info.id,
          account: values.account,
          password: values.password,
          status: values.status,
        };
        this.props
          .dispatch({
            type: 'hall/saveHallLogin',
            payload: data,
            promise: true,
          })
          .then(() => {
            this.props.onSuccess();
          });
      }
    });
  };

  private togglePwdVisiblity = () => {
    this.setState({
      shouldShowPwd: !this.state.shouldShowPwd,
    });
  };

  // 校验第二次输入密码的值
  private checkPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('输入密码不一致！');
    } else {
      callback();
    }
  };

  private accountExist = (rule: any, value: string, callback: (err?: string) => void) => {
    if (value) {
      this.actions.accountExist({ account: value, promise: value }).then((v: any) => {
        if (v.accountExist && v.accountExist.status === 1) {
          callback('登录账号已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };
}

export default Form.create()(LoginEdit as any);

interface LoginEditProps extends BasePageProps {
  // hall?: any;
  // form?: WrappedFormUtils;
  onSuccess: () => void;
}
