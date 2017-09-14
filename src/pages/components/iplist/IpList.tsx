import { Form, Icon, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { compact, uniq } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './IpList.css';

export class LinkInput extends React.PureComponent<LinkInputProps, any> {
  public render() {
    const text = this.props.value;
    // 没有值时为灰色
    const style = !this.props.value ? { color: '#aaaaaa' } : {};
    return (
      <span className="link" onClick={this.props.onClick}>
        <a style={style}>
          {text ? text : '未填写'}
        </a>
        <Icon type="edit" title="点击编辑" />
      </span>
    );
  }
}

interface LinkInputProps {
  dirty: boolean;
  value?: string;
  texts: string;
  onClick: () => void;
  onChange?: (v: string) => void;
}

// tslint:disable-next-line
export default class IpList extends React.PureComponent<IpListProps, any> {
  private input: Input;
  private keys = [] as string[]; // 随机键名，用于产生 form 的 field
  constructor(props: IpListProps) {
    super(props);
    this.state = {
      dirty: props.dirty, // 是否改动过，如果改动过立即验证
    };
  }

  public componentDidMount(): void {
    this.updateInput();
  }

  public componentDidUpdate(prevProps: Readonly<IpListProps>, prevState: Readonly<any>, prevContext: any): void {
    this.updateInput();
  }

  public render() {
    const { lineHeight, name, value } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let vals = compact(this.stringToArray(value));
    if (vals.length === 0) {
      vals = [''];
    }
    if (this.keys.length !== vals.length) {
      vals.forEach((v: string, i: number) => {
        const key = Math.random().toString(16).slice(2);
        this.keys[i] = key;
      });
    }
    const rows = vals.length;
    const h = lineHeight * (rows + 1);
    return (
      <div className="iplist">
        <Input
          ref={ref => (this.input = ref)}
          type="textarea"
          style={{
            display: this.state.editing ? '' : 'none',
            lineHeight: lineHeight + 'px',
            height: h + 10,
            padding: '0 7px',
            width: this.props.width,
          }}
          onBlur={this.onBlur}
          placeholder={'未填写\n'.repeat(rows)}
        />
        {vals.map((k: string, i: number) =>
          <Form.Item
            key={i}
            label={false}
            hasFeedback={this.state.dirty}
            style={{
              display: this.state.editing ? 'none' : 'block',
              paddingLeft: 8,
              marginBottom: 0,
              borderTop: (i > 0 ? 1 : 0) + 'px solid #e9e9e9',
            }}
          >
            {getFieldDecorator(`__iplist__._${this.keys[i]}`, {
              initialValue: vals[i],
              rules: this.props.rules,
            })(
              <LinkInput
                onClick={this.onEdit}
                texts={vals && vals.join(',')}
                dirty={this.state.dirty && getFieldValue(`__iplist__._${this.keys[i]}`)}
              />
            )}
          </Form.Item>
        )}
      </div>
    );
  }

  private updateInput() {
    const elm = ReactDOM.findDOMNode(this.input) as HTMLInputElement;
    if (elm) {
      elm.value = this.props.value || '';
    } else {
      console.warn('没有编辑的话，input 为null');
    }
  }

  private stringToArray(str: string): string[] {
    if (!str) {
      return [];
    } else {
      let st = str.replace(/(\n|，)/g, ',');
      st = st.replace(/(\t|\s)/g, '');
      return uniq(st.split(','));
    }
  }

  private onEdit = () => {
    this.setState({ editing: true });
  };

  private onBlur = (e: any) => {
    this.update(e.target.value);
    this.setState({ editing: false }, () => {
      this.props.form.validateFields(() => 0);
    });
  };

  // 不受控组件不能onChange
  private onChange = (e: any) => {
    this.update(e.target.value);
  };

  private update(str: string) {
    if (typeof this.props.onChange === 'function') {
      this.props.form.resetFields([this.props.name]);
      const vals = this.stringToArray(str);
      vals.forEach((val: string, i: number) => {
        const key = Math.random().toString(16).slice(2);
        this.keys[i] = key;
        this.props.form.setFieldsValue({ [`__iplist__._${key}`]: val });
      });
      this.props.onChange(compact(vals).toString());
    }
  }
}

interface IpListProps {
  onChange?: (value: any) => void;
  name: string; // form field name 用于清空值
  value?: string;
  lineHeight: number; // 行高
  width: number; // textarea 宽
  rules: any[]; // 验证规则
  dirty: boolean; // 验证规则
  form?: WrappedFormUtils;
}
