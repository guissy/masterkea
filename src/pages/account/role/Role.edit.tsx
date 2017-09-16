import { Button, Form, Icon, Input, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import { LangSiteState } from '../../lang.model';
import * as styles from './Role.less';
import { withRole } from './Role.model';
import RoleCheckboxRoot from './RoleCheckboxRoot';
import { connect } from 'kea';

@Form.create()
@connect({
  props: [withRole, ['editingItem', 'permission', 'detail', 'detailLoading', 'saving']],
})
export default class RoleEdit extends React.PureComponent<RoleEditProps, any> {
  constructor(props: RoleEditProps) {
    super(props);
  }

  public componentDidMount(): void {
    this.props.dispatch({ type: 'role/permission', payload: {} });
    if (this.props.editingItem) {
      this.props.dispatch({ type: 'role/detail', payload: { id: this.props.editingItem.id } });
    }
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { site, editingItem = {} } = this.props;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    const tailFormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 24, offset: 8 } };
    let initialValue = [];
    if (this.props.detail && Array.isArray(this.props.detail.routers)) {
      initialValue = this.props.detail.routers;
    }
    if (this.props.detail && Array.isArray(this.props.detail)) {
      initialValue = this.props.detail;
    }
    let loaded = false;
    const permissionRoot = {
      id: 0,
      name: '平台管理权限',
      children: this.props.permission,
      icon: '',
      path: '',
      bdid: '',
      mdid: '',
    };
    if (Array.isArray(permissionRoot.children) && permissionRoot.children.length > 0) {
      // tslint:disable-next-line
      if (this.props.editingItem) {
        // 编辑
        loaded = !this.props.detailLoading && this.props.detail;
      } else {
        // 新增
        loaded = true;
      }
    }
    return loaded ? (
      <Form className={styles.page} onSubmit={this.onSubmit}>
        <Form.Item label={site.角色名称} {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: editingItem.role,
            rules: [{ required: true, message: site.请输入 }],
          })(<Input placeholder={site.请输入} />)}
        </Form.Item>
        <Form.Item label={site.选择平台权限} {...formItemLayout}>
          {getFieldDecorator('roles', {
            initialValue,
            rules: [{ required: false }],
          })(<RoleCheckboxRoot plainOptions={permissionRoot as any} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">
            {this.props.saving && <Icon type="loading" />}
            {site.提交}
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <div style={{ textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subDate: { role: any; auth: any; id: any } = {} as any;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        subDate.role = fieldsValue.name;
        subDate.auth = this.props.permission.filter((v: any) => fieldsValue.roles.has(v.id)).map((v: any) => {
          return {
            ...v,
            children: v.children.filter((w: any) =>
              fieldsValue.roles.get(v.id).some((ww: string) => Number(ww) === w.id)
            ),
          };
        });
      }
      if (this.props.editingItem) {
        subDate.id = this.props.editingItem.id;
      }
      this.props.dispatch({ type: 'role/save', payload: subDate, promise: true }).then(() => {
        this.props.form.resetFields();
        this.props.onSuccess();
        if (this.props.editingItem) {
          this.props.dispatch({ type: 'role/detail', payload: { id: this.props.editingItem.id } });
        }
      });
    });
  };
}

export interface RoleEditProps extends ReduxProps, LangSiteState {
  permission?: any;
  detail?: any;
  detailLoading?: any;
  form?: WrappedFormUtils;
  editingItem?: any;
  saving: boolean;
  onSuccess: () => void;
}
