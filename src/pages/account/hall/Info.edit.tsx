import { Button, Col, Form, Icon, Input, Row } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import * as styles from './Hall.less';
import { kea } from 'kea';
import { withHall } from './Hall.model';

@kea({
  connect: {
    props: [withHall, ['hallLoginLoading', 'hallInfo', 'saveHallInfoLoading']],
  },
})
class InfoEdit extends React.PureComponent<InfoEditProps, any> {
  constructor(props: InfoEditProps) {
    super(props);
  }

  public render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const tailFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const { hallInfoLoading, hallInfo, saveHallInfoLoading } = this.props.hall;
    return (
      <div>
        {!hallInfoLoading && hallInfo
          ? <Form layout="horizontal" onSubmit={this.onSubmit}>
              <Row>
                <Col span={12}>
                  <Form.Item label="厅主账号" {...formItemLayout}>
                    {getFieldDecorator('company_account', {
                      initialValue: hallInfo.company_account,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="厅主名称" {...formItemLayout}>
                    {getFieldDecorator('company_name', {
                      initialValue: hallInfo.company_name,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="登录密码" {...formItemLayout}>
                    {getFieldDecorator('password', {
                      initialValue: hallInfo.password,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="负责人" {...formItemLayout}>
                    {getFieldDecorator('in_charge', {
                      initialValue: hallInfo.in_charge,
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="建立时间" {...formItemLayout}>
                    {getFieldDecorator('created', {
                      initialValue: hallInfo.created,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="联系电话" {...formItemLayout}>
                    {getFieldDecorator('mobile', {
                      initialValue: hallInfo.mobile,
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="微信" {...formItemLayout}>
                    {getFieldDecorator('wechat', {
                      initialValue: hallInfo.wechat,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ID" {...formItemLayout}>
                    {getFieldDecorator('id', {
                      initialValue: hallInfo.id,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="登录账号" {...formItemLayout}>
                    {getFieldDecorator('account', {
                      initialValue: hallInfo.account,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="代理数/会员数" {...formItemLayout}>
                    {getFieldDecorator('agent_num', {
                      initialValue: hallInfo.agent_num + '/' + hallInfo.user_num,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="站内会员账户余额" {...formItemLayout}>
                    {getFieldDecorator('balance', {
                      initialValue: hallInfo.balance,
                    })(<Input disabled={true} />)}
                  </Form.Item>
                  <Form.Item label="QQ" {...formItemLayout}>
                    {getFieldDecorator('qq', {
                      initialValue: hallInfo.qq,
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="skype" {...formItemLayout}>
                    {getFieldDecorator('skype', {
                      initialValue: hallInfo.skype,
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="邮箱" {...formItemLayout}>
                    {getFieldDecorator('email', {
                      initialValue: hallInfo.email,
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="账号前缀" {...tailFormItemLayout}>
                {getFieldDecorator('prefix', {
                  initialValue: hallInfo.prefix,
                })(<Input disabled={true} />)}
              </Form.Item>
              <Form.Item label="备注" {...tailFormItemLayout}>
                {getFieldDecorator('memo', {
                  initialValue: hallInfo.memo,
                })(<Input type="textarea" />)}
              </Form.Item>
              <Form.Item className={styles.submit}>
                <Button type="primary" htmlType="submit" size="large" disabled={saveHallInfoLoading}>
                  {saveHallInfoLoading && <Icon type="loading" />}
                  提交
                </Button>
              </Form.Item>
            </Form>
          : <div>loading</div>}
      </div>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {} as any;
        data.id = values.id;
        data.in_charge = values.in_charge;
        data.mobile = values.mobile;
        data.skype = values.skype;
        data.wechat = values.wechat;
        data.email = values.email;
        data.memo = values.memo;
        data.qq = values.qq;

        dispatch({
          type: 'hall/saveHallInfo',
          payload: data,
          promise: true,
        }).then(() => {
          this.props.onSuccess();
        });
      }
    });
  };
}

export default Form.create()(InfoEdit);

export interface InfoEditProps extends ReduxProps, FormComponentProps {
  hall?: any;
  onSuccess: (p?: any) => void;
}
