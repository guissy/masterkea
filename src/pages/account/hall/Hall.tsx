import { Button, Form, Icon, Modal } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import GameEdit from './Game.edit';
import * as styles from './Hall.less';
import InfoEdit from './Info.edit';
import LoginEdit from './Login.edit';
import MessageEdit from './Message.edit';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';
import BaseModel from '../../abstract/BaseModel';
import * as service from './Hall.service';
import { stringify } from 'querystring';
import { call } from 'redux-saga/effects';

const model = new BaseModel('result', { itemName: '' }, service);
model.addEffect('simpleList');
model.addEffect('hallInfo'); // 获取指定厅主的平台资料
model.addEffect('hallGame'); // 获取指定厅主的游戏设置
model.addEffect('hallLogin'); // 获取指定厅主的登录资料
model.addEffect('exist'); // 指定厅主账号的同名检测
model.addEffect('accountExist'); // 指定厅主登录账号的同名检测
model.addEffect('prefixExist'); // 指定厅主前缀的同名检测
model.addEffect('saveHallInfo', '保存资料', true);
model.addEffect('saveHallGame', '设置游戏');
model.addEffect('saveHallLogin', '设置账号', true);
model.addEffect('sendMessage', '发送消息');
model.addEffect('whitelist', 'IP白名单');

const effects = {
  *openBackend({ payload }: any) {
    const windowObj = window.open('', '_blank');
    windowObj.document.write('Loading...');
    const result = yield call(service.openBackendAjax, payload);
    if (result && result.state === 0) {
      const { is_ssl, domain, ...query } = result.data;
      const http = Boolean(Number(is_ssl)) ? 'https://' : 'http://';
      const href = http + domain + `?path=index&` + stringify(query);
      console.info('\u2714 Hall.model.ts openBackend 36', href);
      windowObj.location.href = href;
    }
  },
};
export const withHall = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: {...model.effects, ...effects},
  props: {
    site: withLang,
  },
});
@withHall
class Hall extends BasePage<HallProps, any> {
  private mainWidth: number;
  private domainPromise: Promise<any>;
  constructor(props: HallProps) {
    const companyAccountPromise = props.dispatch({ type: 'hall/simpleList', promise: true }).then(data => ({
      list: data.simpleList.map((item: HallSimpleItem) => ({
        title: item.company_account,
        value: item.company_account,
      })),
    }));

    const config: BasePageConfig = {
      ns: 'hall',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      withEdit: false,
      canCreate: false,
      rowSelection: true,
      columns: [
        {
          title: '厅主名称',
          dataIndex: 'company_name',
          canForm: true,
        },
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          canForm: true,
        },
        {
          title: '负责人',
          dataIndex: 'in_charge',
        },
        {
          title: '账号前缀',
          dataIndex: 'prefix',
          canForm: true,
        },
        {
          title: '联系电话',
          dataIndex: 'mobile',
          canShow: false,
          canForm: true,
        },
        {
          title: '备注',
          dataIndex: 'memo',
          canShow: false,
          required: false,
          formType: FormType.TextArea,
          canForm: true,
        },
        {
          title: '厅主后台登录账号',
          dataIndex: 'account',
          render: (text, { id }) =>
            text
              ? text
              : <a
                  onClick={() => {
                    this.props.dispatch({ type: 'hall/hallLogin', payload: { id } });
                    this.props.dispatch({ type: 'hall/infoSuccess', payload: { info: { id } } });
                    this.setState({ id, isEditingLogin: true });
                  }}
                >
                  {' '}设置{' '}
                </a>,
        },
        {
          title: '代理数/会员数',
          dataIndex: 'agent_user_num',
        },
        {
          title: '建立人',
          dataIndex: 'creator',
        },
        {
          title: '建立时间',
          dataIndex: 'created',
        },
        {
          title: '账号状态',
          dataIndex: 'status',
        },
        {
          title: '在线状态',
          dataIndex: 'online',
          render: value =>
            <span style={{ color: value === 1 ? '#87d068' : '#AAA' }}>
              {value === 1 ? '在线' : '离线'}
            </span>,
        },
        {
          title: '厅主后台',
          dataIndex: 'tz',
          render: (text, record) =>
            <div
              className={styles.tzLink}
              onClick={() => {
                this.onLoginHall(record);
              }}
            >
              <p>
                {this.mainWidth > 1080 &&
                  <span className={styles.tzName}>
                    {record.company_name}
                  </span>}
                <span className={styles.txt}>
                  后台 <Icon type="export" />
                </span>
              </p>
            </div>,
        },
      ],
      searchs: [
        {
          title: '厅主账号',
          dataIndex: 'company_account',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: companyAccountPromise,
        },
        {
          title: '负责人',
          dataIndex: 'in_charge',
        },
        {
          title: '账号状态',
          dataIndex: 'status',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [{ title: '启用', value: '1' }, { title: '停用', value: '0' }],
        },
        {
          title: '在线状态',
          dataIndex: 'online',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [{ title: '在线', value: '1' }, { title: '离线', value: '0' }],
        },
      ],
      actions: [
        {
          label: '资料',
          onClick: ({ id }) => {
            this.props.dispatch({ type: 'hall/hallInfo', payload: { id } });
            this.setState({ id, isEditingInfo: true });
          },
        },
        {
          label: '游戏',
          onClick: ({ id }) => {
            this.props.dispatch({ type: 'hall/hallGame', payload: { id } });
            this.props.dispatch({ type: 'hall/infoSuccess', payload: { info: { id } } });
            this.setState({ id, isEditingGame: true });
          },
        },
        {
          label: 'IP白名单',
          onClick: editingItem => {
            this.props.dispatch({ type: 'hall/hallInfo', payload: { id: editingItem.id }, promise: true }).then(v => {
              this.setState({ editingItem: v.hallInfo });
            });
            this.setState({ editingItem, isWhitelist: true });
          },
        },
        {
          label: '业务单元',
          onClick: ({ id }) => {
            // this.props.dispatch(push({ pathname: '/account/webset', query: { hall_id: id } }));
          },
        },
      ],
    };
    super(props, config);
    this.afterComponent = this.getViewComponent.bind(this);
    this.state.id = 0;
    this.state.editingItem = {};
    this.domainPromise = props.dispatch({ type: 'webset/noAssign', promise: true }).then(v => ({
      list: v.noAssign.map((w: any) => ({ id: w.id, name: `${w.domain} (${w.name} ${w.threshold_number} 人)` })),
    }));
    this.footer = () =>
      <div>
        <Button
          className="e2e-sendNews"
          type="primary"
          loading={this.props.hall.loading}
          disabled={!(this.state.selectedRowKeys.length > 0)}
          onClick={() => {
            this.setState({ id: Date.now(), isEditingMessage: true });
          }}
          style={{ marginRight: 15 }}
        >
          <Icon type="file" />批量发送消息
        </Button>
      </div>;
    const aside = document.querySelector('aside');
    this.mainWidth = window.innerWidth - (aside ? aside.clientWidth : 0);
  }

  public onLoginHall(record: any): void {
    this.props.dispatch({
      type: 'hall/openBackend',
      payload: { tid: record.id },
    });
  }

  private getViewComponent() {
    const { list } = this.props.hall as any;
    return (
      <div>
        <Modal
          key={'info' + this.state.id}
          title="厅主基本资料"
          visible={this.state.isEditingInfo}
          onCancel={this.onCancelView.bind(this, 'isEditingInfo')}
          footer={null}
          width={800}
        >
          <InfoEdit onSuccess={this.onCancelView.bind(this, 'isEditingInfo')} />
        </Modal>
        <Modal
          key={'game' + this.state.id}
          title="游戏设置"
          visible={this.state.isEditingGame}
          onCancel={this.onCancelView.bind(this, 'isEditingGame')}
          footer={null}
          width={800}
        >
          <GameEdit onSuccess={this.onCancelView.bind(this, 'isEditingGame')} />
        </Modal>
        <Modal
          key={'whitelist' + this.state.editingItem.id}
          title="IP白名单"
          visible={this.state.isWhitelist}
          onCancel={this.onCancelView.bind(this, 'isWhitelist')}
          footer={null}
          width={800}
        >
          <div>
            {/*<Row>*/}
            {/*<Col span={5}>*/}
            {/*厅主名称：*/}
            {/*</Col>*/}
            {/*<Col span={15}>*/}
            {/*{this.state.editingItem.company_name}*/}
            {/*</Col>*/}
            {/*</Row>*/}
            <SimpleEdit
              loading={false}
              editingItem={this.state.editingItem}
              saving={false}
              fields={[
                {
                  title: '厅主名称',
                  dataIndex: 'company_name',
                  formType: FormType.Static,
                },
                {
                  title: 'IP地址',
                  dataIndex: 'whitelist',
                  formType: FormType.IpList,
                },
                {
                  title: '厅主ID',
                  dataIndex: 'id',
                  formType: FormType.Hidden,
                },
              ]}
              ns="hall"
              effect="whitelist"
              okText="提交"
              onSuccess={this.onCancelView.bind(this, 'isWhitelist')}
            />
          </div>
        </Modal>
        <Modal
          key={'domain' + this.state.id}
          title="业务单元"
          visible={this.state.isEditingDomain}
          onCancel={this.onCancelView.bind(this, 'isEditingDomain')}
          footer={null}
          width={800}
        >
          <SimpleEdit
            loading={false}
            editingItem={{ hall_id: this.state.id }}
            saving={false}
            fields={[
              {
                title: '业务单元',
                dataIndex: 'id',
                formType: FormType.Select,
                dataSource: this.domainPromise,
              },
              {
                title: '厅主ID',
                dataIndex: 'hall_id',
                formType: FormType.Hidden,
              },
            ]}
            ns="webset"
            effect="assign"
            okText="提交"
            onSuccess={this.onCancelView.bind(this, 'isEditingDomain')}
          />
        </Modal>
        <Modal
          key={'login' + this.state.id}
          title="设置厅主登录账号"
          visible={this.state.isEditingLogin}
          onCancel={this.onCancelView.bind(this, 'isEditingLogin')}
          footer={null}
          width={800}
        >
          <LoginEdit onSuccess={this.onCancelView.bind(this, 'isEditingLogin')} />
        </Modal>
        <Modal
          key={'message' + this.state.id}
          title="批量发送消息"
          visible={this.state.isEditingMessage}
          onCancel={this.onCancelView.bind(this, 'isEditingMessage')}
          footer={null}
          width={800}
        >
          <MessageEdit
            ids={this.state.selectedRowKeys}
            halls={list}
            onSuccess={this.onCancelView.bind(this, 'isEditingMessage')}
          />
        </Modal>
      </div>
    );
  }

  private onCancelView(key: string) {
    this.setState({
      [key]: false,
    });
  }
}

export default Form.create()(Hall as any);

export interface HallProps extends BasePageProps {
}


// 体育 视讯 电子游戏 体育
export interface GameCategory {
  lottery: GameCategoryItem[];
  live: GameCategoryItem[];
  game: GameCategoryItem[];
  sports: GameCategoryItem[];
}

export interface GameCategoryName {
  lottery: string[];
  live: string[];
  game: string[];
  sports: string[];
}

export interface GameCategoryItem {
  id: number;
  name: string;
  checked?: boolean;
  game_type?: string;
}

// 厅主下拉列表
export interface HallSimpleItem {
  id: number;
  company_account: string;
}