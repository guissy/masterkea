import { Alert, Button, Col, Form, Icon, Input, Row, Select, Steps } from 'antd';
import { flatten } from 'lodash';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import SelectAll from '../hall/SelectAll';
import * as styles from './Build.less';
import { BuildState, withBuiuld } from './Build.model';
import { GameCategory, GameCategoryName } from '../hall/Hall';
import { Link } from 'react-router-dom';
import { WebsetState } from '../webset/Webset.model';

// @connect(({ build, hall, webset, lang }: Store) => ({ build, hall, webset, site: lang.site }))
@withBuiuld
@Form.create()
export default class Build extends BasePage<BuildProps, any> {
  constructor(props: BuildProps) {
    const config: BasePageConfig = {
      ns: 'build',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withDelete: false,
      canCreate: false,
      withStatus: false,
      withOperator: false,
      columns: [],
      searchs: [],
    };
    super(props, config);
    this.state.current = 0;
    this.state.shouldShowPwd = false;
    this.state.webset = {};
    this.togglePwdVisiblity = this.togglePwdVisiblity.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAssign = this.onAssign.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.exist = this.exist.bind(this);
    this.accountExist = this.accountExist.bind(this);
    this.prefixExist = this.prefixExist.bind(this);
    this.openBackend = this.openBackend.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  public componentWillMount(): void {
    this.props.dispatch({ type: 'hall/hallGame', payload: { id: 2 } });
    this.props.dispatch({ type: 'webset/noAssign' });
  }
  public componentDidMount() {
    // do nothing 为了不执行父类的函数体
  }
  public render() {
    const total = 4;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { hallGame } = this.props;
    const options: GameCategoryName = { lottery: [], live: [], game: [], sports: [] };
    const values: GameCategoryName = { lottery: [], live: [], game: [], sports: [] };
    if (hallGame) {
      ['lottery', 'live', 'game', 'sports'].forEach((key: keyof GameCategory) => {
        if (hallGame[key]) {
          options[key] = hallGame[key].map((item: any) => item.name);
          values[key] = hallGame[key].filter((item: any) => item.checked).map((item: any) => item.name);
        }
      });
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      hasFeedback: true,
    };
    const formItem = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const webset = this.state.webset;
    const building = this.props.saving;
    return (
      <div>
        <Form className={styles.form}>
          <Steps current={this.state.current}>
            <Steps.Step title="选择主机配置" />
            <Steps.Step title="游戏设置" />
            <Steps.Step title="添加厅主账号" />
            <Steps.Step title="创建登录账号" />
            <Steps.Step title="完成" />
          </Steps>
          <div className={styles.content}>
            <section hidden={this.state.current !== 0}>
              <Form.Item label="选主机配置" {...formItemLayout}>
                {getFieldDecorator('host_id', {
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Select onChange={this.onAssign}>
                    {this.props.noAssign.map((w: any, i: number) => (
                      <Select.Option key={w.id}>{`${w.domain} ( ${w.name} ${w.threshold_number} 人)`}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Alert
                message={
                  <span>
                    这里仅显示未占用的主机配置，若没有列出，点击<Link to="/account/webset">这里</Link>查看或创建新的主机配置
                  </span>
                }
                banner={true}
              />
            </section>
            <section hidden={this.state.current !== 1}>
              <Form.Item label="彩票游戏" {...formItem}>
                {getFieldDecorator('game_list[0]', {
                  initialValue: values.lottery,
                })(<SelectAll options={options.lottery} />)}
              </Form.Item>
              <Form.Item label="视讯平台" {...formItem}>
                {getFieldDecorator('game_list[1]', {
                  initialValue: values.live,
                })(<SelectAll options={options.live} />)}
              </Form.Item>
              <Form.Item label="电子平台" {...formItem}>
                {getFieldDecorator('game_list[2]', {
                  initialValue: values.game,
                })(<SelectAll options={options.game} />)}
              </Form.Item>
              <Form.Item label="体育" {...formItem}>
                {getFieldDecorator('game_list[3]', {
                  initialValue: values.sports,
                })(<SelectAll options={options.sports} />)}
              </Form.Item>
            </section>
            <section hidden={this.state.current !== 2}>
              <Form.Item label="厅主账号" {...formItemLayout}>
                {getFieldDecorator('company_account', {
                  rules: [{ required: true, message: '不能为空' }, { validator: this.exist }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="厅主名称" {...formItemLayout}>
                {getFieldDecorator('company_name', {
                  rules: [{ required: true, message: '不能为空' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="会员账号前缀" {...formItemLayout}>
                {getFieldDecorator('prefix', {
                  rules: [{ required: true, message: '不能为空' }, { validator: this.prefixExist }],
                })(<Input />)}
              </Form.Item>
              <Alert message="此信息仅用于平台的后台管理，不付出现厅主的后台管理" banner={true} />
            </section>
            <section hidden={this.state.current !== 3}>
              <Form.Item label="登录账号" {...formItemLayout}>
                {getFieldDecorator('account', {
                  rules: [{ required: true, message: '不能为空' }, { validator: this.accountExist }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="登录密码" {...formItemLayout}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Input
                    type={this.state.shouldShowPwd ? 'text' : 'password'}
                    style={{ cursor: 'pointer' }}
                    suffix={
                      <Icon type={this.state.shouldShowPwd ? 'eye-o' : 'eye'} onClick={this.togglePwdVisiblity} />
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="M令牌开启" {...formItemLayout}>
                {getFieldDecorator('mtoken_status', {
                  initialValue: '1',
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Select>
                    <Select.Option value="1">启用</Select.Option>
                    <Select.Option value="0">停用</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="状态" {...formItemLayout}>
                {getFieldDecorator('status', {
                  initialValue: '1',
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Select>
                    <Select.Option value="1">启用</Select.Option>
                    <Select.Option value="0">停用</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Alert message="给厅主开通一个厅主后台的超级管理员账号。厅主用这个账号登录厅主后台 可以再建立子账号" banner={true} />
            </section>
            <section className={styles.preview} hidden={this.state.current !== 4}>
              <Row>
                <Col span={4}>主机配置</Col>
                <Col span={20}>
                  <p>
                    <span>负载级别</span>
                    <span>{`${webset.name} ${webset.threshold_number} 人`}</span>
                  </p>
                  <p>
                    <span>标识域名</span>
                    <span>
                      {webset.domain}
                      &nbsp;&nbsp;
                      <a className={styles.copy} onClick={() => this.onCopy()}>
                        复制
                      </a>
                      &nbsp;&nbsp;
                      <a onClick={this.openBackend} target="_blank">
                        立即跳到标识域名进行初始化配置
                      </a>
                    </span>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={4}>游戏设置</Col>
                <Col span={20}>
                  <p>
                    <span>彩票游戏</span>
                    <span>
                      <SelectAll value={getFieldValue('game_list[0]')} options={options.lottery} readOnly={true} />
                    </span>
                  </p>
                  <p>
                    <span>视讯平台</span>
                    <span>
                      <SelectAll value={getFieldValue('game_list[1]')} options={options.live} readOnly={true} />
                    </span>
                  </p>
                  <p>
                    <span>电子平台</span>
                    <span>
                      <SelectAll value={getFieldValue('game_list[2]')} options={options.game} readOnly={true} />
                    </span>
                  </p>
                  <p>
                    <span>体育</span>
                    <span>
                      <SelectAll value={getFieldValue('game_list[3]')} options={options.sports} readOnly={true} />
                    </span>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={4}>厅主账号</Col>
                <Col span={20}>
                  <p>
                    <span>厅主账号</span>
                    <span> {getFieldValue('company_account')} </span>
                  </p>
                  <p>
                    <span>厅主名称</span>
                    <span> {getFieldValue('company_name')}</span>
                  </p>
                  <p>
                    <span>会员账号前缀</span>
                    <span> {getFieldValue('prefix')}</span>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={4}>登录账号</Col>
                <Col span={20}>
                  <p>
                    <span>登录账号</span>
                    <span> {getFieldValue('account')} </span>
                  </p>
                  <p>
                    <span>M令牌开启</span>
                    <span> {String(getFieldValue('mtoken')) === '1' ? '启用' : '停用'} </span>
                  </p>
                  <p>
                    <span>状态</span>
                    <span> {String(getFieldValue('status')) === '1' ? '启用' : '停用'} </span>
                  </p>
                </Col>
              </Row>
            </section>
          </div>
          <div className={styles.btns}>
            {this.state.current > 0 &&
            this.state.current < total && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()} disabled={building}>
                上一步
              </Button>
            )}
            {this.state.current < total - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {this.state.current === total - 1 && (
              <Button type="primary" size="large" onClick={this.onSubmit} disabled={building}>
                {building && <Icon type="loading" />}
                完成
              </Button>
            )}
            {this.state.current === total && (
              <Button type="primary" size="large" onClick={this.openBackend} disabled={building}>
                跳到标识域名进行初始化配置
              </Button>
            )}
          </div>
        </Form>
      </div>
    );
  }
  private onSubmit() {
    this.props.form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      const { hallGame } = this.props;
      let gameList = flatten(values.game_list);
      gameList = flatten(Object.values(hallGame)).filter(v => gameList.includes(v.name));
      values.game_list = gameList.map(({ id, name, game_type }) => ({ id, name, game_type }));
      this.props.dispatch({ type: 'build/save', payload: values, promise: true }).then(() => {
        const current = this.state.current + 1;
        this.setState({ current });
      });
    });
  }
  private onCopy() {
    const http = Boolean(Number(this.state.webset.is_ssl)) ? 'https://' : 'http://';
    const text = http + this.state.webset.domain;
    const textArea = document.createElement('textarea');
    try {
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'success', message: '复制成功' } });
      } else {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
      }
    } catch (err) {
      this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
    } finally {
      document.body.removeChild(textArea);
    }
  }
  private onAssign(val: string) {
    const webset = this.props.noAssign.find((v: any) => v.id === val);
    if (webset) {
      this.setState({ webset });
    }
  }
  private next() {
    let hasError = false;
    this.props.form.validateFields(err => {
      if (this.state.current === 0 && err && err.host_id) {
        hasError = true;
      } else if (this.state.current === 2 && err && (err.company_account || err.company_name || err.prefix)) {
        hasError = true;
      }
      if (!hasError) {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  }
  private prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  private togglePwdVisiblity() {
    this.setState({
      shouldShowPwd: !this.state.shouldShowPwd,
    });
  }
  private openBackend() {
    const buildId = this.props.hall_id;
    this.props.dispatch({ type: 'hall/openBackend', payload: { tid: buildId } });
  }
  private exist(rule: any, value: string, callback: (err?: string) => void) {
    if (value) {
      this.actions.exist({ account: value, promise: value }).then(v => {
        if (v.exist && v.exist.status === 1) {
          callback('账户已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  }
  private accountExist(rule: any, value: string, callback: (err?: string) => void) {
    if (value) {
      this.actions.accountExist({ account: value, promise: value }).then(v => {
        if (v.accountExist && v.accountExist.status === 1) {
          callback('账户已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  }
  private prefixExist(rule: any, value: string, callback: (err?: string) => void) {
    if (value) {
      this.actions.prefixExist({ prefix: value, promise: value }).then(v => {
        if (v.prefixExist && v.prefixExist.status === 1) {
          callback('前缀已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  }
}

export interface BuildProps extends Partial<BuildState>, Partial<WebsetState>, BasePageProps {}
