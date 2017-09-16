import { Form, Icon, Input, Switch } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps } from '../abstract/BasePage';
import SimpleEdit from '../abstract/SimpleEdit';
import { withLang } from '../lang.model';
import './Stage.css';
import createWith from '../../utils/buildKea';
import BaseModel from '../abstract/BaseModel';
import * as service from './Stage.service';

const model = new BaseModel('stage', { itemName: '' }, service);

@Form.create()
@createWith({
  namespace: model.namespace,
  state: model.state,
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
})
export default class Stage extends BasePage<StageProps, any> {
  constructor(props: StageProps) {
    const config: BasePageConfig = {
      ns: 'stage',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withStatus: false,
      withOperator: false,
      canCreate: false,
      columns: [
        {
          title: '彩票名称',
          dataIndex: 'lottery_name',
        },
        {
          title: '当前期号',
          dataIndex: 'lottery_number',
        },
        {
          title: '开盘时间',
          dataIndex: 'start_time',
        },
        {
          title: '封盘时间',
          dataIndex: 'end_time',
        },
        {
          title: '自动派奖',
          dataIndex: 'is_auto',
          key: 'is_auto',
          render: (text, record, index) => {
            return (
              <Switch
                defaultChecked={text === '1' ? true : false}
                size="small"
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                onChange={(text: boolean) =>
                  this.props.dispatch({
                    type: 'date/update',
                    payload: [{ id: record.l_id, is_auto: text ? 1 : 0, stop_bet: record.before_unrebate_seconds }],
                  })}
              />
            );
          },
        },
        {
          title: '封盘时间改为官方开奖前',
          dataIndex: 'stop_bet',
          key: 'stop_bet',
          render: (text, record, index) => {
            return (
              <div>
                <Form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    if (e.currentTarget.stop_bet.value === text) return; // tslint:disable-line
                    if (e.currentTarget.stop_bet.value < 0) return; // tslint:disable-line
                    this.props.dispatch({
                      type: 'date/save',
                      payload: [{ id: record.l_id, stop_bet: e.currentTarget.stop_bet.value }],
                    });
                  }}
                >
                  <Input
                    type="number"
                    addonAfter="秒"
                    name="stop_bet"
                    size="small"
                    className="e2e-stopTime"
                    defaultValue={text}
                    onBlur={e => {
                      if (e.currentTarget.value === text) return; // tslint:disable-line
                      if (e.currentTarget.value < 0) return; // tslint:disable-line
                      this.props.dispatch({
                        type: 'date/save',
                        payload: [{ id: record.l_id, stop_bet: e.currentTarget.value }],
                      });
                    }}
                  />
                </Form>
              </div>
            );
          },
        },
      ],
      searchs: [],
    };

    super(props, config);
  }
}

export interface StageProps extends BasePageProps {
  // form?: WrappedFormUtils;
  // stage?: StageState;
}
