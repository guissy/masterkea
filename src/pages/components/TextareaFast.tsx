import { Form, Icon, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class LinkInput extends React.PureComponent<LinkInputProps, any> {
  public componentWillReceiveProps(nextProps: Readonly<LinkInputProps>, nextContext: any): void {
    if (this.props.texts !== nextProps.texts) {
      this.props.onChange(nextProps.value);
    }
  }

  public render() {
    const text = this.props.value;
    const password = this.props.password;
    // 没有值时为灰色
    const style = !this.props.value ? { color: '#aaaaaa' } : {};
    let str = '';
    // tslint:disable-next-line
    if (password) {
      str = text ? '******' : '未填写';
    } else {
      str = text ? text : '未填写';
    }
    return (
      <span className="link" onClick={this.props.onClick}>
        <a style={style}>
          {str}
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
  password?: boolean;
}

// tslint:disable-next-line
export default class TextareaFast extends React.PureComponent<TextareaFastProps, any> {
  private input: Input;
  private lastValue: string[] = null; // 上次编辑过内容，用于比较是否删除一行
  constructor(props: TextareaFastProps) {
    super(props);
    this.state = {
      editing: props.onlyEdit,
      dirty: props.dirty, // 是否改动过，如果改动过立即验证
      values: props.values || [],
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<TextareaFastProps>, nextContext: any): void {
    if (this.props.onlyEdit || !this.state.values.length) {
      this.setState({ value: nextProps.values });
    }
  }

  public componentDidMount(): void {
    this.updateInput();
  }

  public componentDidUpdate(prevProps: Readonly<TextareaFastProps>, prevState: Readonly<any>, prevContext: any): void {
    this.updateInput();
  }

  private updateInput() {
    const elm = ReactDOM.findDOMNode(this.input) as HTMLInputElement;
    if (elm) {
      const { nameToList, nameTo, name } = this.props;
      const vals = nameToList.map(k => {
        const val = this.state.values.find((value: any) => value[nameTo] === k);
        return val && val[name];
      });
      elm.value = vals ? vals.join('\n') : '';
    } else {
      console.warn('没有编辑的话，input 为null');
    }
  }

  public render() {
    const { nameToList, parent, nameTo, name, lineHeight, showNameTo, onlyEdit } = this.props;
    const values = this.state.values;
    const vals = nameToList.map(k => {
      const val = values.find((value: any) => value[nameTo] === k);
      return val && val[name];
    });
    if (!this.lastValue) {
      this.lastValue = vals;
    }
    const ids = nameToList.map(k => {
      const val = values.find((value: any) => value[nameTo] === k);
      return val && val.id;
    });
    const rows = nameToList.length;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = showNameTo ? { labelCol: { span: 5 }, wrapperCol: { span: 12 } } : {};
    // value={vals && vals.join('\n')}
    console.log('\u2714 TextareaFast render 96', this.props.width);
    return (
      <div>
        <Input
          ref={ref => (this.input = ref)}
          type="textarea"
          style={{
            display: this.state.editing ? '' : 'none',
            lineHeight: lineHeight + 'px',
            height: lineHeight * rows + 10,
            padding: '0 7px',
            width: this.props.width,
          }}
          onBlur={this.onBlur}
          onPressEnter={this.onPressEnter}
          placeholder={'未填写\n'.repeat(rows)}
        />
        {!onlyEdit &&
          nameToList.map((k, i) =>
            <Form.Item
              key={i}
              label={showNameTo ? k : false}
              hasFeedback={this.state.dirty}
              style={{
                display: this.state.editing ? 'none' : 'block',
                height: i === 0 ? 40 : i % 2 ? 42 : 41,
                paddingLeft: 8,
                borderTop: (i > 0 ? 1 : 0) + 'px solid #e9e9e9',
              }}
              {...formItemLayout}
            >
              {getFieldDecorator(`${parent}[${i}].${name}`, {
                initialValue: vals[i],
                rules: this.props.rules,
              })(<LinkInput onClick={this.onEdit} texts={vals && vals.join(',')} dirty={this.state.dirty} />)}
              {getFieldDecorator(`${parent}[${i}].${nameTo}`, { initialValue: k })(<input hidden={true} />)}
              {getFieldDecorator(`${parent}[${i}].id`, { initialValue: ids[i] })(<input hidden={true} />)}
            </Form.Item>
          )}
      </div>
    );
  }

  private onEdit = () => {
    this.setState({ editing: true });
  };

  private onBlur = (e: any) => {
    this.update(e.target.value);
    this.setState({ editing: false });
  };

  // 不受控组件不能onChange
  private onChange = (e: any) => {
    this.update(e.target.value);
  };

  private onPressEnter = (e: React.FormEvent<any>) => {
    const str = (e.target as any).value;
    const value = str.split('\n');
    const total = this.props.nameToList.length;
    // 最后一个不为空
    if (value.length >= total && value[total - 1] && value[total - 1].trim()) {
      e.preventDefault();
      if (value.every((v: string) => !!v && !!v.trim())) {
        // 如果都不为空回车将退出编辑
        this.update(str);
        this.setState({ editing: false });
      }
    }
  };

  private update(str: string) {
    const value = str.split('\n');
    const last = this.lastValue;
    const { nameToList, parent, name, nameTo } = this.props;
    let isDeletingEmpty = false;
    last.forEach((row: string, i: number) => {
      if (!row && last.slice(i + 1).every((row1: string, j: number) => row1 === value[i + j])) {
        isDeletingEmpty = true;
      }
    });
    if (isDeletingEmpty) {
      console.warn('不允许删除空行');
    }
    if (this.props.canFill) {
      const [first, ...rest] = value;
      if (rest.length === 0) {
        nameToList.slice(1).forEach(() => value.push(first));
      } else if (!!first && rest.every((v: string) => !v)) {
        value.fill(first);
      }
    }
    nameToList.forEach((_: string, i: number) => {
      if (last[i] !== value[i]) {
        const fullname = `${parent}[${i}].${name}`;
        this.props.form.setFieldsValue({ [fullname]: value[i] });
      }
    });
    const valueOld = nameToList
      .map(k => {
        const val = this.props.values.find((value0: any) => value0[nameTo] === k);
        return val && val[name];
      })
      .join('\n');
    if (valueOld !== str || this.state.dirty) {
      const formValue = this.props.form.getFieldsValue() as any;
      this.setState({ values: formValue[parent], dirty: true });
      if (this.props.onChange) {
        const values = this.props.values.map((v: any) => {
          const w0 = formValue[parent].find((w: any) => w[nameTo] === v[nameTo]);
          return { ...v, [name]: w0 && w0[name] };
        });
        this.props.onChange(values);
      } else {
        this.props.onChange(null);
      }
    }
  }
}

interface TextareaFastProps {
  nameToList: string[]; // 表单项名称, 由外键组成的数组，要根据 nameToList 值排序 values
  showNameTo: boolean; // 显示表单项名称
  onlyEdit: boolean;
  onChange?: (value: any) => void; // 当 onlyEdit 时，需要将值更新显示
  parent: string; // 键的前缀，form 键实际为：parent[i].name
  nameTo: string; // 外键：values[i][nameTo] 对应 names[i]
  name: string; // 键的后缀，form 键实际为：parent[i].name
  values: any[]; // 数组元素为对象，包含 nameTo 和 name
  canFill: boolean; // 填充（填充第一行的值）
  lineHeight: number; // 行高
  width: number; // textarea 宽
  rules: any[]; // 验证规则
  dirty: boolean; // 验证规则
  form?: WrappedFormUtils;
}
