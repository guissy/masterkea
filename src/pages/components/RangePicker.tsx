import { DatePicker, Form } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';

export default class DateRange extends React.Component<DateRangeProps, any> {
  constructor(props: DateRangeProps) {
    super(props);
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { startField, endField } = this.props;

    return (
      <span>
        <Form.Item label={this.props.label}>
          {getFieldDecorator(startField, {})(
            <DatePicker
              disabledDate={this.disabledStartDate}
              showTime={true}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始时间"
              onChange={this.onStartChange}
            />
          )}
        </Form.Item>
        <Form.Item label="-" colon={false}>
          {getFieldDecorator(endField, {})(
            <DatePicker
              disabledDate={this.disabledEndDate}
              showTime={true}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="结束时间"
              onChange={this.onEndChange}
            />
          )}
        </Form.Item>
      </span>
    );
  }

  private disabledStartDate = (startValue: any) => {
    const endValue = this.props.form.getFieldValue(this.props.endField);
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  private disabledEndDate = (endValue: any) => {
    const startValue = this.props.form.getFieldValue(this.props.startField);
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  private onChange = (field: string, value: any) => {
    this.props.form.setFields({
      [field]: value,
    });
  };

  private onStartChange = (value: any) => {
    this.onChange(this.props.startField, value);
  };

  private onEndChange = (value: any) => {
    this.onChange(this.props.endField, value);
  };
}

interface DateRangeProps {
  form: WrappedFormUtils;
  startField: string;
  endField: string;
  label: string;
}
