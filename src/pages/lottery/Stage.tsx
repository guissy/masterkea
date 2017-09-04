import { Form, Icon, Input, Switch } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
// import { connect } from 'dva';
import * as React from 'react';
// import { Store } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, Actions } from '../abstract/BasePage';
import SimpleEdit from '../abstract/SimpleEdit';
import { LangSiteState, withLang } from '../lang.model';
import './Stage.css';
import { Action, kea } from "kea";
import createWith from "../../utils/buildKea";
import BaseModel from "../abstract/BaseModel";
// import { StageState } from './Stage.model';
import * as service from './Stage.service';


// @connect(({ date, lang }: Store) => ({ date, site: lang.site }))
const model = new BaseModel('stage', {itemName: ''}, service);

@createWith({
  namespace: model.namespace,
  state: { [model.namespace]: model.state },
  actions: new Actions(),
  effects: model.effects,
  props: {
    site: withLang,
  },
})
class Stage extends BasePage<StageProps, any> {
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
                  onSubmit={e => {
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

export default Form.create()(Stage)

export interface StageProps extends ReduxProps, LangSiteState, FormComponentProps {
  // form?: WrappedFormUtils;
  // stage?: StageState;
}
