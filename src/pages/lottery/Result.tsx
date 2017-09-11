import { Form, Input, message, Tag } from 'antd';
import * as React from 'react';
import BasePage, { Actions, BasePageConfig, BasePageProps, FormType } from '../abstract/BasePage';
import SimpleEdit from '../abstract/SimpleEdit';
import { withLang } from '../lang.model';
import { datetime } from '../../utils/date';
import { default as BaseModel } from '../abstract/BaseModel';
import createWith from '../../utils/buildKea';
import * as service from './Result.service';

const model = new BaseModel('result', { itemName: '' }, service);
model.addEffect('type');

let resolve: any;
const promise = new Promise(r => (resolve = r));
@createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
})
class Result extends BasePage<ResultProps, any> {
  constructor(props: ResultProps) {
    const config: BasePageConfig = {
      ns: 'result',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withStatus: false,
      canCreate: false,
      withEdit: false,
      columns: [
        {
          title: '日期',
          dataIndex: 'start_time',
          render: timestamp => datetime(timestamp),
        },
        {
          title: '彩票名称',
          dataIndex: 'lottery_name',
        },
        {
          title: '期号',
          dataIndex: 'lottery_number',
        },
        {
          title: '获取号码时间',
          dataIndex: 'catch_time',
        },
        {
          // TODO: 3.0版本实现开奖号码修改
          title: '开奖号码',
          dataIndex: 'period_code',
          render: (text, record, index) => {
            return (
              <Input
                style={{ textAlign: 'center' }}
                className="e2e-periodCode"
                defaultValue={text}
                placeholder="请输入开奖号码，以逗号分隔开"
                onChange={e => {
                  message.info('此功能暂未开放，请等下个版本更新');
                }}
              />
            );
          },
        },
        {
          title: '开奖状态',
          dataIndex: 'state',
          canForm: true,
          render: text => {
            return (
              <div className="stateTag">
                {text &&
                  text.split(',').map((txt: string) => {
                    let elm;
                    switch (txt) {
                      case 'send':
                        elm = (
                          <Tag key={txt} color="#2db7f5">
                            已派奖
                          </Tag>
                        );
                        break;
                      case 'stop':
                        elm = (
                          <Tag key={txt} color="#f50">
                            停售
                          </Tag>
                        );
                        break;
                      case 'open':
                        elm = (
                          <Tag key={txt} color="orange">
                            已开奖
                          </Tag>
                        );
                        break;
                      case 'valid':
                        elm = (
                          <Tag key={txt} color="#87d068">
                            有效
                          </Tag>
                        );
                        break;
                      default:
                        elm = (
                          <Tag key={txt} color="#108ee9">
                            未开奖
                          </Tag>
                        );
                    }
                    return elm;
                  })}
              </div>
            );
          },
        },
      ],
      searchs: [
        {
          title: '彩种名称',
          dataIndex: 'lottery_id',
          formType: FormType.Select,
          initialValue: '2',
          dataSource: promise as any,
        },
        {
          title: '开奖状态',
          dataIndex: 'state',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: Promise.resolve({
            list: [{ id: 1, title: '未开奖' }, { id: 2, title: '已开奖' }],
          }),
        },
        {
          title: '日期',
          dataIndex: 'start_time,end_time',
          formType: FormType.DateRange,
        },
      ],
      // TODO: 重置开奖3.0版本实现
      actions: [
        {
          label: '重置开奖',
          onClick: ({ id }: any) => {
            message.info('此功能暂未开放，请等下个版本更新');
          },
        },
      ],
    };
    super(props, config);
  }

  componentDidMount(): void {
    this.props.actions.type({ promise: true }).then(v => {
      // console.log(v.type);
      const list = v.type.filter((w: any) => w.pid !== '0');
      if (list.length > 0) {
        this.props.actions.query({ lottery_id: list[0].id });
      }
      resolve({ list });
      return { list };
    });
  }
}

export default Form.create()(Result as any);

export interface ResultProps extends BasePageProps {
  // form?: WrappedFormUtils;
  // result?: ResultState;
}
