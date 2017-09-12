import { Form, Modal } from 'antd';
import * as React from 'react';
import { default as BaseModel } from '../../abstract/BaseModel';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withLang } from '../../lang.model';
import PasswordEdit from './PasswordEdit';
import * as service from './Subaccount.service';
import createWith from '../../../utils/buildKea';
import { withRole } from '../role/Role.model';

const model = new BaseModel('subaccount', { itemName: '' }, service);
model.addEffect('exists');
model.addEffect('password', '修改密码');

export const withSubaccount = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
    query: withRole,
  },
})
@withSubaccount
class Subaccount extends BasePage<SubaccountProps, any> {
  constructor(props: SubaccountProps) {
    const config: BasePageConfig = {
      ns: 'subaccount',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withEdit: false,
      columns: [
        {
          title: '账号',
          dataIndex: 'username',
          canFormCreate: true,
          formType: FormType.Account,
          minLength: 4,
        },
        {
          title: '真实姓名',
          dataIndex: 'truename',
          canShow: false,
          canFormCreate: true,
        },
        {
          title: '密码',
          dataIndex: 'password',
          canShow: false,
          canFormCreate: true,
          formType: FormType.Password,
        },
        {
          title: '确认密码',
          dataIndex: 'password2',
          canShow: false,
          canFormCreate: true,
          formType: FormType.Password2,
        },
        {
          title: '角色',
          dataIndex: 'role',
          canFormCreate: true,
          formType: FormType.Radio,
          dataSource: Promise.resolve()
            .then(() => this.actions.query({ promise: true }))
            .then(({ list }) => ({ list: list.map((v: any) => ({ ...v, title: v.role })) })),
        },
        {
          title: '登录IP',
          dataIndex: 'loginip',
        },
        {
          title: '最近登录时间',
          dataIndex: 'logintime',
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
      ],
      searchs: [],
      actions: [
        {
          label: '改密',
          onClick: editingItem => {
            this.setState({ editingItem, isShowPassword: true });
          },
        },
      ],
    };
    super(props, config);
    this.state = {
      ...this.state,
      isShowPassword: false,
    };
    this.afterComponent = this.getPasswordComponent.bind(this);
    this.onCancelPassword = this.onCancelPassword.bind(this);
  }

  private getPasswordComponent() {
    const { site } = this.props;
    const { saving } = this.props;
    return (
      <Modal
        key="update"
        title={site.修改密码}
        visible={this.state.isShowPassword}
        onCancel={this.onCancelPassword}
        footer={null}
      >
        <PasswordEdit editingItem={this.state.editingItem} saving={saving} onSuccess={this.onCancelPassword} />
      </Modal>
    );
  }

  private onCancelPassword() {
    this.setState({
      isShowPassword: false,
    });
  }
}

export default Form.create()(Subaccount)

export interface SubaccountProps extends BasePageProps {
}
