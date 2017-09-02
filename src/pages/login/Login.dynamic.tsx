import { Button, Form, Input, Modal } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as QRCode from 'qrcode.react'; // tslint:disable-line import-name
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { withLang, LangSiteState } from '../lang.model';
import { kea, KeaOption } from 'kea';
import './Login.css';

@kea({
  connect: {
    props: [withLang, ['site']],
  },
})
class LoginDynamic extends React.PureComponent<LoginDynamicProps, any> {
  private input: React.ReactInstance;

  constructor(props: LoginDynamicProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const login = this.props;
    const { form, site, loading } = this.props;
    const { getFieldDecorator } = form;
    const dynamicFormItemLayout = { labelCol: { span: 8 }, wrapperCol: { offset: 4, span: 16 } };
    const qrcode = 'otpauth://totp/' + login.mtoken + '?&secret=' + login.secret;
    const QRCodeWrap = QRCode as any;
    return (
      <Modal
        wrapClassName="loginModal"
        title={login.mtoken && login.secret ? '扫描二维码后填写动态密码' : '填写动态密码'}
        visible={login.visible}
        footer={null}
        onCancel={this.onCancel}
      >
        <Form className="dynamic" onSubmit={this.onSubmit}>
          {login.mtoken &&
          login.secret && (
            <Form.Item {...dynamicFormItemLayout} hasFeedback={true}>
              <QRCodeWrap value={qrcode} size={200} />
            </Form.Item>
          )}
          <Form.Item {...dynamicFormItemLayout} hasFeedback={true}>
            {getFieldDecorator('code', {
              initialValue: '',
              rules: [{ required: true, message: site.请输入动态密码 }],
            })(
              <Input
                type="text"
                size="large"
                placeholder={site.请输入动态密码}
                autoFocus={true}
                ref={ref => (this.input = ref)}
              />
            )}
          </Form.Item>
          <Form.Item {...dynamicFormItemLayout} hasFeedback={true}>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  public componentDidUpdated(): void {
    ReactDOM.findDOMNode(this.input)
      .querySelector('input')
      .focus();
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSubmit(this.props.form);
  };

  private onCancel = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.onCancel();
  };
}

interface LoginDynamicProps extends ReduxProps, LangSiteState, FormComponentProps {
  mtoken: string;
  secret: string;
  loading: boolean;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (form: WrappedFormUtils) => void;
}

export default Form.create()(LoginDynamic);
