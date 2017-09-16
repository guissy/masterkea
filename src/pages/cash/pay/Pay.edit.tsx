import { Button, Form, Icon, Input, Upload } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';

import * as React from 'react';
import { getImageOption } from '../../../utils/upload';
import { Store } from '../../abstract/BaseModel';
import { LangSiteState } from '../../lang.model';
import * as styles from './Pay.less';
import { PayState, withPay } from './Pay.model';

@Form.create()
@withPay
export default class Pay extends React.PureComponent<PayProps, any> {
  constructor(props: PayProps) {
    super(props);
    this.state = {};
  }
  public render() {
    const { getFieldDecorator } = this.props.form;
    const { site, editingItem = {}, saving } = this.props;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    const tailFormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 24, offset: 8 } };

    return (
      <Form className={styles.page} onSubmit={this.onSubmit}>
        <Form.Item label="支付渠道" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: editingItem.name,
            rules: [{ required: true, message: site.请输入支付渠道 }],
          })(<Input placeholder={site.请输入支付渠道} />)}
        </Form.Item>
        <Form.Item label={site.支付接口名称} {...formItemLayout}>
          {getFieldDecorator('pay_name', {
            initialValue: editingItem.pay_name,
            rules: [{ required: true, message: site.请输入支付接口名称 }],
          })(<Input placeholder={site.请输入支付接口名称} />)}
        </Form.Item>
        <Form.Item label="LOGO" {...formItemLayout}>
          {getFieldDecorator('logo', {
            initialValue: editingItem.logo,
            rules: [{ required: true, message: site.请上传图片 }],
          })(
            <Upload {...getImageOption(editingItem.logo)}>
              <Button type="ghost">
                <Icon type="upload" />上传
              </Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item label={site.通知URL} {...formItemLayout}>
          {getFieldDecorator('url_notify', {
            initialValue: editingItem.url_notify,
            rules: [{ required: true, message: site.请输入通知URL }],
          })(<Input placeholder={site.请输入通知URL} />)}
        </Form.Item>
        <Form.Item label={site.确认URL} {...formItemLayout}>
          {getFieldDecorator('url_return', {
            initialValue: editingItem.url_return,
            rules: [{ required: true, message: site.请输入确认URL }],
          })(<Input placeholder={site.请输入确认URL} />)}
        </Form.Item>
        <Form.Item label={site.描述} {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: editingItem.description,
            rules: [{ required: false, message: site.请输入描述 }],
          })(<Input type="textarea" placeholder={site.请输入描述} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">
            {saving && <Icon type="loading" />}
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
      // tslint:disable-next-line
      if (fieldsValue.logo && fieldsValue.logo.file) {
        fieldsValue.logo = fieldsValue.logo.file.response.imgName; // 新上传的
      } else {
        fieldsValue.logo = this.props.editingItem.logo; // 恢复原来的值
      }
      if (this.props.editingItem && this.props.editingItem.id) {
        fieldsValue.id = this.props.editingItem.id;
      }
      this.props.dispatch({ type: 'pay/save', payload: fieldsValue, promise: true }).then(() => {
        this.props.form.resetFields();
      });
    });
  };
}

export interface PayProps extends ReduxProps, LangSiteState {
  pay?: PayState;
  form?: WrappedFormUtils;
  editingItem?: any;
  saving?: boolean;
}
