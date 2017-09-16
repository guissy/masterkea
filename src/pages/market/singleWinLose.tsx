import { Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import * as styles from '../market/singleWinLose.less';

export default class SingleWinLose extends React.PureComponent<SingleWinLoseProps, any> {
  constructor(props: SingleWinLoseProps) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      min: value.min || 0,
      max: value.max || 0,
      own: value.own || 0,
    };
  }

  public componentWillReceiveProps(nextProps: SingleWinLoseProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  public render() {
    return (
      <div className={styles.single}>
        <Row>
          <Form layout="inline">
            <Col span={8} style={{ textAlign: 'right' }}>
              <Form.Item label="输赢">
                <Input value={this.state.min} onChange={this.handleMinChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="——————" colon={false}>
                <Input value={this.state.max} onChange={this.handleMaxChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="占成比例">
                <Input value={this.state.own} onChange={this.handleOwnChange} />
                <span style={{ marginLeft: 6 }}>%</span>
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </div>
    );
  }

  private handleMinChange = (e: any) => {
    const min = e.target.value;
    // 不受控时自己更新
    if (!('value' in this.props)) {
      this.setState({
        min,
      });
    }
    this.triggerChange({ min });
  };

  private handleMaxChange = (e: any) => {
    const max = e.target.value;
    if (!('value' in this.props)) {
      this.setState({
        max,
      });
    }
    this.triggerChange({ max });
  };
  private handleOwnChange = (e: any) => {
    const own = e.target.value;
    if (!('value' in this.props)) {
      this.setState({
        own,
      });
    }
    this.triggerChange({ own });
  };

  private triggerChange = (changedValue: any) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({ ...this.state, ...changedValue });
    }
  };
}

interface SingleWinLoseProps {
  value?: any;
  onChange?: any;
}
