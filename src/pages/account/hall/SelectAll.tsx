import { Checkbox, Col, Row } from 'antd';
import * as React from 'react';

export default class SelectAll extends React.Component<SelectAllProps, any> {
  constructor(props: SelectAllProps) {
    super(props);

    const value = this.props.value || [];
    const plainOptions = this.props.options || [];
    this.state = {
      value,
      indeterminate: !!value.length && value.length < plainOptions.length,
      checkAll: value.length === plainOptions.length,
    };
  }

  public componentWillReceiveProps(nextProps: SelectAllProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const plainOptions = nextProps.options;
      const value = nextProps.value;
      this.setState({
        value,
        indeterminate: !!value.length && value.length < plainOptions.length,
        checkAll: value.length === plainOptions.length,
      });
    }
  }

  public render() {
    const state = this.state;
    const { options } = this.props;
    return (
      <div>
        <Row type="flex" justify="start">
          {!this.props.readOnly &&
            <Col span={6}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全选
              </Checkbox>
            </Col>}
          <Col span={18}>
            <Checkbox.Group
              value={state.value}
              options={options}
              onChange={this.handleCheckBoxChange}
              disabled={this.props.readOnly}
            />
          </Col>
        </Row>
      </div>
    );
  }

  private handleCheckBoxChange = (checkedList: any[]) => {
    const plainOptions = this.props.options;
    this.setState({
      value: checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
    this.triggerChange(checkedList);
  };

  private onCheckAllChange = (e: React.FormEvent<any>) => {
    const plainOptions = this.props.options;
    const checked = (e.target as any).checked;
    this.setState({
      value: checked ? plainOptions : [],
      indeterminate: false,
      checkAll: checked,
    });
    this.triggerChange(checked ? plainOptions : []);
  };

  private triggerChange = (changedValue: any) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };
}

interface SelectAllProps {
  value?: any;
  options?: any;
  onChange?: (val: any) => void;
  readOnly?: boolean; // 是否可操作
}
