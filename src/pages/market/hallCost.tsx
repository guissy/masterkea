import { Button, Col, Form, Icon, InputNumber, Popconfirm, Row, Table, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';

import { isEqual } from 'lodash';
import * as React from 'react';
import { Dispatch } from 'react-redux';
import buildRowKey from '../../utils/buildRowKey';
import { Store } from '../abstract/BaseModel';
import * as style from './singleWinLose.less';
import { HallCostState, withHallCost } from './hallCost.model';
import { BasePageProps } from '../abstract/BasePage';

function form(func: any): any {
  return (...args: any[]) => {
    const result = new func(...args);
    const oriGetForm = result.getForm;
    result.getForm = () => {
      const oriResult = oriGetForm();
      oriResult.fieldsStore = result.fieldsStore;
      oriResult.saveRef = result.saveRef;
      return oriResult;
    };
    return result;
  };
}

@withHallCost
@form
@Form.create()
export default class HallCost extends React.PureComponent<HallCostProps, any> {
  private columns: any;

  constructor(props: HallCostProps) {
    super(props);
    this.state = {
      dataSource: [],
      formId: 0,
    };
    this.updateColumn();
  }

  public onChangeRecord(value: any, key: string, row: number) {
    // const value = parseInt((e.target as HTMLInputElement).value, 10);
    const dataSource = this.state.dataSource.map((w: any) => ({ ...w, [key]: w.row === row ? value : w[key] }));
    this.setState({ dataSource });
  }

  public componentWillMount() {
    console.log('☞☞☞ hallCost componentWillMount 44', this);
    this.props.dispatch({
      type: 'hallcost/getHallCost',
    });
  }

  public componentWillReceiveProps(nextProps: HallCostProps) {
    // 只有服务器有新请求后才更新 dataSource
    if (!isEqual(this.props.hallCost, nextProps.hallCost) || this.state.dataSource.length === 0) {
      const b = nextProps.hallCost.game;

      const list = [];
      let row = 0;
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < b[i].list.length; j++) {
          const obj = {
            row,
            index: i,
            listIndex: j,
            name: b[i].name,
            min: b[i].list[j].min,
            max: b[i].list[j].max,
            own: b[i].list[j].own,
            length: b[i].list.length,
            id:
              '_' +
              Math.random()
                .toString(16)
                .slice(2),
            rowSpan: j === 0 ? b[i].list.length : 0,
          };
          row += 1;
          list.push(obj);
        }
      }
      this.setState({ dataSource: list });
    } else if (!isEqual(this.props.dataSource, nextProps.dataSource) || this.state.dataSource.length === 0) {
      this.setState({ dataSource: nextProps.dataSource });
    }
  }

  public render() {
    // const { game } = this.props.hallcost;
    const { hallCost } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };

    return (
      <div className={style.button}>
        {this.state.dataSource.length ? (
          <div>
            <h2 className={style.h2}>游戏输赢分成设置</h2>
            <Form>
              <Table
                columns={this.columns}
                size="small"
                dataSource={this.state.dataSource}
                bordered={true}
                pagination={false}
                rowKey={buildRowKey}
              />
            </Form>
            <Row>
              <Col offset={6} span={12}>
                <h2 className={style.h2}>包网费用设置</h2>
                <Form.Item label="线路费" {...formItemLayout}>
                  {getFieldDecorator('line', { initialValue: hallCost.packet.line })(<InputNumber min={0} />)}
                </Form.Item>
                <Form.Item label="维护费" {...formItemLayout}>
                  {getFieldDecorator('packet.service', { initialValue: hallCost.packet.service })(
                    <InputNumber min={0} />
                  )}
                </Form.Item>
                <Form.Item label="包底" {...formItemLayout}>
                  {getFieldDecorator('packet.mincost', { initialValue: hallCost.packet.mincost })(
                    <InputNumber min={0} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="e2e-row-member">
              <Col offset={6} span={12}>
                <h2 className={style.h2}>会员存款分成</h2>
                <Form.Item label="线下充值" {...formItemLayout}>
                  {getFieldDecorator('recharge.offline', { initialValue: hallCost.recharge.offline })(
                    <InputNumber min={0} />
                  )}
                </Form.Item>
                <Form.Item label="线上充值" {...formItemLayout}>
                  {getFieldDecorator('recharge.online', { initialValue: hallCost.recharge.online })(
                    <InputNumber min={0} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={40} style={{ textAlign: 'center' }} className="e2e-row-submit">
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.onSubmit}>
                提交
              </Button>
              <Button type="primary" onClick={this.onReset}>
                重置
              </Button>
            </Row>
          </div>
        ) : null}
      </div>
    );
  }

  private updateColumn() {
    this.columns = [
      {
        title: '游戏',
        dataIndex: 'name',
        key: 'name',
        render: (val: string, record: any, index: number) => {
          this.props.form.getFieldDecorator(`game[${record.index}].name`, { initialValue: val });
          return {
            children: val,
            props: { rowSpan: record.rowSpan },
          };
        },
      },
      {
        title: '输',
        dataIndex: 'min',
        key: 'min',
        render: (text: number, record: any) => {
          return this.props.form.getFieldDecorator(`game[${record.index}].list.${record.id}.min`, {
            initialValue: text,
          })(<InputNumber onChange={v => this.onChangeRecord(v, 'min', record.row)} style={{ width: 150 }} min={0} />);
        },
      },
      {
        title: '赢',
        dataIndex: 'max',
        key: 'max',
        render: (text: number, record: any, index: number) => {
          // 提交数据前，先根据 listIndex 排序
          this.props.form.getFieldDecorator(`game[${record.index}].list.${record.id}.listIndex`, {
            initialValue: index,
          });
          return this.props.form.getFieldDecorator(`game[${record.index}].list.${record.id}.max`, {
            initialValue: text,
          })(<InputNumber onChange={v => this.onChangeRecord(v, 'max', record.row)} style={{ width: 150 }} min={0} />);
        },
      },
      {
        title: '占成比例',
        dataIndex: 'own',
        key: 'own',
        render: (text: number, record: any) => {
          return this.props.form.getFieldDecorator(`game[${record.index}].list.${record.id}.own`, {
            initialValue: text,
          })(
            <InputNumber
              onChange={v => this.onChangeRecord(v, 'own', record.row)}
              style={{ width: 150 }}
              formatter={value => `${value}%`}
              min={0}
            />
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'delete',
        render: (text: any, record: any, index: number) => {
          return (
            <div>
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record)}>
                <a href="#" className={record.listIndex === 0 ? style.disabled : ''}>
                  <Icon type="delete" /> 删除
                </a>
              </Popconfirm>

              {record.listIndex === record.length - 1 && (
                <Button onClick={() => this.handleAdd(record)} style={{ border: 'none', background: 'transparent' }}>
                  <Icon type="plus-circle-o" /> 增加
                </Button>
              )}
            </div>
          );
        },
      },
    ];
  }

  private onSubmit = () => {
    const data = this.props.form.getFieldsValue() as any;
    const { game } = data as any;
    data.game = game.map((v: any, i: number) => {
      const it = { name: v.name, list: [] as any };
      // 对象转数组：id转0,1,2
      it.list = Object.keys(v.list)
        .map((id: string) => {
          const w = v.list[id];
          return { min: Number(w.min), max: Number(w.max), own: Number(w.own) };
        })
        .sort((a: any, b: any) => a.listIndex - b.listIndex)
        .filter((w: any) => !isNaN(w.min));
      return it;
    });
    // console.log('\u2665 onSubmit 231', data);
    this.props.dispatch({
      type: 'hallcost/updateHallCost',
      payload: {
        data,
      },
    });
  };

  // 删除
  private onDelete = (record: any) => {
    const len = record.length;
    // 排除要删除的
    const dataSource = this.state.dataSource.filter((item: any) => item.row !== record.row);
    // 当前组的首行 -1
    const item = dataSource.find((v: any) => v.index === record.index && v.listIndex === 0);
    item.length = len - 1;
    item.rowSpan = len - 1;
    // 当前组的其他行 -1
    const list = [] as any[];
    dataSource.forEach((v: any, i: number) => {
      v.row = i;
      if (v.index === record.index) {
        v.length = len - 1;
        list.push({ min: v.min, max: v.max, own: v.own });
      }
    });
    this.setState({ dataSource });
  };

  // 新增一行
  private handleAdd = (record: any) => {
    const { dataSource } = this.state;
    const len = record.length;
    const newData = {
      name: record.name,
      index: record.index,
      listIndex: len,
      min: 0,
      max: 0,
      own: 0,
      rowSpan: 0,
      id:
        '_' +
        Math.random()
          .toString(16)
          .slice(2),
    };
    const newer = dataSource.slice();
    // 当前组的首行 +1
    newer[record.row - len + 1].rowSpan = len + 1;
    newer[record.row - len + 1].length = len + 1;
    newer.splice(record.row + 1, 0, newData);
    // 当前组的其他行 +1
    newer.forEach((v: any, i: number) => {
      v.row = i;
      if (v.index === record.index) {
        v.length = len + 1;
      }
    });
    this.setState({
      dataSource: newer,
    });
  };

  private onReset = () => {
    this.setState({ dataSource: [] });
    this.props.dispatch({
      type: 'hallcost/resetHallCost',
    });
  };

  private updateForm = (hallcost: any) => {
    const { form } = this.props;
    hallcost.game.forEach((element: any, index: number) => {
      const fieldName = `game.${index}`;
      form.setFieldsValue({ [fieldName]: element });
    });

    // tslint:disable-next-line
    for (const key in hallcost.packet) {
      const fieldName = `packet.${key}`;
      form.setFieldsValue({ [fieldName]: hallcost.packet[key] });
    }

    // tslint:disable-next-line
    for (const key in hallcost.recharge) {
      const fieldName = `recharge.${key}`;
      form.setFieldsValue({ [fieldName]: hallcost.recharge[key] });
    }
  };
}
interface HallCostProps extends Partial<HallCostState>, BasePageProps {}
