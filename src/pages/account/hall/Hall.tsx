import { Button, Form, Icon, Modal } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import GameEdit from './Game.edit';
import * as styles from './Hall.less';
import InfoEdit from './Info.edit';
import LoginEdit from './Login.edit';
import MessageEdit from './Message.edit';
import { withHall } from './Hall.model';
import { push } from 'react-router-redux';

@Form.create()
@withHall
export default class Hall extends BasePage<HallProps, any> {
  private mainWidth: number;
  private domainPromise: Promise<any>;
  constructor(props: HallProps) {
    const companyAccountPromise = Promise.resolve()
      .then(() => this.actions.simpleList({ promise: true }))
      .then(data => ({
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
            text ? (
              text
            ) : (
              <a
                onClick={() => {
                  this.props.dispatch({ type: 'hall/hallLogin', payload: { id } });
                  this.props.dispatch({ type: 'hall/infoSuccess', payload: { info: { id } } });
                  this.setState({ id, isEditingLogin: true });
                }}
              >
                {' '}
                设置{' '}
              </a>
            ),
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
          render: value => <span style={{ color: value === 1 ? '#87d068' : '#AAA' }}>{value === 1 ? '在线' : '离线'}</span>,
        },
        {
          title: '厅主后台',
          dataIndex: 'tz',
          render: (text, record) => (
            <div
              className={styles.tzLink}
              onClick={() => {
                this.onLoginHall(record);
              }}
            >
              <p>
                {this.mainWidth > 1080 && <span className={styles.tzName}>{record.company_name}</span>}
                <span className={styles.txt}>
                  后台 <Icon type="export" />
                </span>
              </p>
            </div>
          ),
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
            this.actions.hallInfo({ id });
            this.setState({ id, isEditingInfo: true });
          },
        },
        {
          label: '游戏',
          onClick: ({ id }) => {
            this.actions.hallGame({ id });
            // this.props.dispatch({ type: 'hall/infoSuccess', payload: { info: { id } } });
            this.setState({ id, isEditingGame: true });
          },
        },
        {
          label: 'IP白名单',
          onClick: editingItem => {
            this.actions.hallInfo({ id: editingItem.id, promise: true }).then(v => {
              this.setState({ editingItem: v.hallInfo });
            });
            this.setState({ editingItem, isWhitelist: true });
          },
        },
        {
          label: '业务单元',
          onClick: ({ id }) => {
            this.props.dispatch(push({ pathname: '/account/webset', query: { hall_id: id } } as any));
          },
        },
      ],
    };
    super(props, config);
    this.afterComponent = this.getViewComponent.bind(this);
    this.state.id = 0;
    this.state.editingItem = {};
    this.domainPromise = Promise.resolve()
      // .then(() => this.props.actions.noAssign({ promise: true }))
      .then(() => ({ noAssign: [] }))
      .then(v => ({
        list: v.noAssign.map((w: any) => ({ id: w.id, name: `${w.domain} (${w.name} ${w.threshold_number} 人)` })),
      }));
    this.footer = () => (
      <div>
        <Button
          className="e2e-sendNews"
          type="primary"
          loading={this.props.loading}
          disabled={!(this.state.selectedRowKeys.length > 0)}
          onClick={() => {
            this.setState({ id: Date.now(), isEditingMessage: true });
          }}
          style={{ marginRight: 15 }}
        >
          <Icon type="file" />批量发送消息
        </Button>
      </div>
    );
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
    const { list } = this.props as any;
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

export interface HallProps extends BasePageProps {}

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
