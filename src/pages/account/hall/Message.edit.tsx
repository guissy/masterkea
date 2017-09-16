import { Button, Form, Input, Tag, Tooltip } from 'antd';
import * as React from 'react';
import * as styles from './Hall.less';
import { HallSimpleItem } from './Hall';
import { kea } from 'kea';
import { withHall } from './Hall.model';
import { FormComponentProps } from '../../../../typings/antd/index';

@Form.create()
@kea({
  connect: {
    props: [withHall, ['sendMessageLoading', 'hallLogin']],
  },
})
export default class MessageEdit extends React.Component<MessageEditProps, any> {
  constructor(props: MessageEditProps) {
    super(props);

    this.state = {
      isSending: false,
      deleted: [],
      halls: props.halls.filter(v => props.ids.includes(v.id)),
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<MessageEditProps>, nextContext: any): void {
    this.setState({
      halls: nextProps.halls.filter((v: any) => nextProps.ids.includes(v.id) && !this.state.deleted.includes(v.id)),
      isSending: nextProps.sendMessageLoading,
    });
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 24, offset: 8 } };

    return (
      <Form layout="horizontal">
        <Form.Item label="接收人" {...formItemLayout}>
          {this.state.halls.map((tag: HallSimpleItem) => {
            const isLongTag = tag.company_account.length > 10;
            const tagElem = (
              <Tag key={tag.id} closable={this.state.halls.length !== 1} afterClose={() => this.removeHall(tag)}>
                {isLongTag ? `${tag.company_account.slice(0, 20)}...` : tag.company_account}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
          })}
        </Form.Item>
        <Form.Item label="标题" {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [{ required: true, message: '不能为空' }],
          })(<Input placeholder="标题必填" />)}
        </Form.Item>
        <Form.Item label="内容" {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: '',
            rules: [{ required: true, message: '不能为空' }, { max: 800, message: '最多不得超过800字' }],
          })(<Input type="textarea" placeholder="内容必填，字数限800" className={styles.content} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button loading={this.props.sendMessageLoading} type="primary" onClick={this.sendMessage}>
            发送
          </Button>
        </Form.Item>
      </Form>
    );
  }

  private sendMessage = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.recipient = this.state.halls.map((v: any) => v.company_account).join(',');
        this.props
          .dispatch({
            type: 'hall/sendMessage',
            payload: { ...values },
            promise: true,
          })
          .then(() => {
            this.props.form.resetFields();
            this.props.onSuccess();
          });
      }
    });
  };

  private removeHall = ({ id }: any) => {
    const deleted = this.state.deleted.concat(id);
    const halls = this.state.halls.filter((v: any) => !deleted.includes(v.id));
    this.setState({ deleted, halls });
  };
}

interface MessageEditProps extends ReduxProps, FormComponentProps {
  sendMessageLoading?: any;
  halls: HallSimpleItem[];
  onSuccess: () => void;
  ids: any;
}
