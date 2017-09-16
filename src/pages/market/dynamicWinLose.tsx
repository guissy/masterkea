import { Button, Col, Form, Icon, Row } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
// tslint:disable-next-line
import SingleWinLose from './singleWinLose';

let uuid = 0;

@Form.create()
export default class DynamicWinLose extends React.PureComponent<DynamicWinLoseProps, any> {
  private keyInitailized = false;
  constructor(props: DynamicWinLoseProps) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      name: value.name || '',
      list: value.list || [],
    };
  }
  public componentWillReceiveProps(nextProps: DynamicWinLoseProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
      if (nextProps.value !== this.props.value && this.props.value) {
        // 重置
        uuid = 0;
        this.keyInitailized = false;
        this.props.form.setFieldsValue({ keys: [] });
        value.list.forEach(() => {
          this.add();
        });
        this.keyInitailized = true;
        this.updateSingle(value.list);
      }
    }
  }

  public componentWillMount() {
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    this.state.list.forEach(() => {
      this.add();
    });
    this.keyInitailized = true;
  }

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const keys = getFieldValue('keys');
    const formItems = keys.map((k: string, index: number) => {
      return (
        <Row key={k} style={{ marginTop: '15px' }}>
          <Col span={19}>
            {getFieldDecorator(`names-${k}`, {
              initialValue: this.state.list[index],
            })(<SingleWinLose onChange={(changedValue: string) => this.triggerChange(`names-${k}`, changedValue)} />)}
          </Col>

          <Col span={5}>
            <Button type="primary" onClick={() => this.remove(k)} className="e2e-del">
              <Icon type="delete" />删除
            </Button>
          </Col>
        </Row>
      );
    });

    return (
      <div>
        <Button type="primary" onClick={this.add} className="e2e-add">
          <Icon type="plus" /> 添加
        </Button>
        {formItems}
      </div>
    );
  }

  private remove = (k: any) => {
    const { form } = this.props;
    const onChange = this.props.onChange;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter((key: string) => key !== k),
    });

    const newList = this.state.list.filter((item: string, index: number) => {
      return index !== keys.indexOf(k);
    });

    if (!('value' in this.props)) {
      this.setState({
        name: this.state.name,
        list: newList,
      });
    }

    if (onChange) {
      onChange({ name: this.state.name, list: newList });
    }
  };

  private add = () => {
    uuid += 1;
    const { form, onChange } = this.props;
    // can use data-binding to get

    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    if (this.keyInitailized) {
      const newList = this.state.list.concat({ min: 0, max: 0, own: 0 });
      if (!('value' in this.props)) {
        this.setState({
          name: this.state.name,
          list: newList,
        });
      }
      if (onChange) {
        onChange({ name: this.state.name, list: newList });
      }
    }
  };

  private triggerChange = (key: string, changedValue: string) => {
    const onChange = this.props.onChange;
    if (onChange) {
      const winLoseList = this.getNames(key, changedValue);
      if (!('value' in this.props)) {
        this.setState(winLoseList);
      }
      onChange(winLoseList);
    }
  };

  private getNames = (key: string, changedValue: string) => {
    const result = { name: this.state.name, list: [] as any };
    const fieldsValue = this.props.form.getFieldsValue();
    const changed = { [key]: changedValue };
    const data = { ...fieldsValue, ...changed } as any;
    for (const k in data) {
      if (k.indexOf('name') > -1) {
        result.list.push(data[k]);
      }
    }
    return result;
  };

  private updateSingle = (list: any[]) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    list.forEach((element, index) => {
      const fieldName = `names-${keys[index]}`;
      form.setFieldsValue({ [fieldName]: element });
    });
  };
}

interface DynamicWinLoseProps {
  value?: any;
  form?: WrappedFormUtils;
  onChange?: any;
}
